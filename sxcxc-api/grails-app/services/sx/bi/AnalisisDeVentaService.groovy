package sx.bi

import javax.sql.DataSource

import groovy.util.logging.Slf4j
import groovy.sql.Sql

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import grails.gorm.transactions.NotTransactional
import grails.util.Environment

import sx.utils.Periodo

@Slf4j
// @GrailsCompileStatic
class AnalisisDeVentaService {

  DataSource dataSource

  @Transactional
  void generar(){
    log.info('Generando tabla de analisis: {}')
  }

  @NotTransactional
  def List ventaNetaMensual(VentaMensualCommand command) {
    log.debug('Analisis de venta mensual: {}', command)
    Sql sql = new Sql(dataSource)
    String query = buildQuery(command.ejercicio, command.mes, command.slice, command.tipoDeVenta, command.tipoDeProducto)
    return sql.rows(query)
  }

  String  buildQuery(Integer ejercicio, Integer mes, String slice, String tipoDeVenta, String tipoProducto) {

    Periodo periodo = Periodo.getPeriodoEnUnMes( mes - 1, ejercicio)

    String sql = getQuery()

    sql = sql.replaceAll("@BI_SCHEMA", getSchemaBi())
    sql = sql.replaceAll("@PROD_SCHEMA", getSchema())

		sql = sql.replaceAll("@YEAR", ejercicio.toString())
		sql = sql.replaceAll("@MES", mes.toString())
		sql = sql.replaceAll("@FECHA_INI", periodo.fechaInicial.format('yyyy-MM-dd 00:00:00'))
		sql = sql.replaceAll("@FECHA_FIN", periodo.fechaFinal.format('yyyy-MM-dd 23:00:00'))

		// Definir Slice del CUBO
		switch(slice) {
			case 'LINEA':
				sql = sql.replaceAll("@DESCRIPCION",  "'LIN' AS TIPO,D.LINEA_ID AS origenId,D.LINEA")
				sql = sql.replaceAll("@INVENTARIO", "'LIN' AS TIPO,L.ID AS origenId,L.LINEA")
				break
			case 'CLIENTE':
				sql = sql.replaceAll("@DESCRIPCION",  "'EXI' AS TIPO,D.CLIENTE_ID AS origenId,(CASE WHEN D.CLIENTE_ID = '402880fc5e4ec411015e4ecc5dfc0554' THEN '1 MOSTRADOR' ELSE D.CLIENTE END)")
				sql = sql.replaceAll("@INVENTARIO", "'EXI' AS TIPO, 8 AS origenId, '1 MOSTRADOR'")
				break
			case 'PRODUCTO':
				sql = sql.replaceAll("@DESCRIPCION",  "'PRD' AS TIPO,D.PRODUCTO_ID AS origenId,CONCAT(D.CLAVE,' ',D.DESCRIPCION)")
				sql = sql.replaceAll("@INVENTARIO", "'PRD' AS TIPO,D.PRODUCTO_ID AS origenId,CONCAT(D.CLAVE,' ',P.DESCRIPCION)")
				break
			case 'SUCURSAL':
				sql = sql.replaceAll("@DESCRIPCION",  "'SUC' AS TIPO, D.SUCURSAL_ID AS origenId, D.SUC")
				sql = sql.replaceAll("@INVENTARIO", "'SUC' AS TIPO,D.SUCURSAL_ID AS origenId, (SELECT S.NOMBRE FROM @PROD_SCHEMA.sucursal S WHERE S.ID = D.SUCURSAL_ID)")
        sql = sql.replaceAll("@PROD_SCHEMA", getSchema())
				break
			case 'VENTA':
				sql = sql.replaceAll("@DESCRIPCION", "'EXI' AS TIPO,1 AS origenId,(CASE WHEN D.ORIGEN='CRE' THEN 'CREDITO' ELSE 'CONTADO' END)")
				sql = sql.replaceAll("@INVENTARIO", "'EXI' AS TIPO,1 AS origenId,'CREDITO'")
				break
			case 'MES':
				sql = sql.replaceAll("@DESCRIPCION", "'MES' AS TIPO, MONTH(D.FECHA) AS origenId,(SELECT M.MES_NOMBRE FROM @BI_SCHEMA.meses M WHERE M.MES=MONTH(D.FECHA))")
				sql = sql.replaceAll("@INVENTARIO", "'MES' AS TIPO,D.MES AS origenId,(SELECT M.MES_NOMBRE FROM @BI_SCHEMA.meses M WHERE M.MES=MONTH(D.FECHA))")
        sql = sql.replaceAll("@BI_SCHEMA", getSchemaBi())
				break
			default:
				break
		}


		// Tipo de VENTA (CREDITO / CONTADO / TODAS
		switch(tipoDeVenta) {
			case 'CREDITO':
				sql=sql.replaceAll("@VENTA", " AND (CASE WHEN D.ORIGEN='CRE' THEN 'CREDITO' ELSE 'CONTADO' END) IN('CREDITO') ")
				break
			case 'CONTADO':
				sql=sql.replaceAll("@VENTA", " AND (CASE WHEN D.ORIGEN='CRE' THEN 'CREDITO' ELSE 'CONTADO' END) IN('CONTADO') ")
				break
			default:
				sql = sql.replaceAll("@VENTA", "")
				break
		}

		// Tipo de producto (NACIONAL / IMPORTADO / TODOS)
		switch(tipoProducto) {
			case 'IMPORTADO':
				sql = sql.replaceAll("@TIPO_PROD", " AND  D.NACIONAL IS FALSE ")
				break
			case 'NACIONAL':
				sql = sql.replaceAll("@TIPO_PROD", " AND  D.NACIONAL IS TRUE  ")
				break
			default:
        sql = sql.replaceAll("@TIPO_PROD", "")
				break
		}
		return sql
	}

  String getQuery() {
    return """
    SELECT X.periodo
    ,X.origenId
    ,X.DESCRIP AS descripcion
    ,ROUND(SUM(X.IMP_NETO),2) AS ventaNeta
    ,ROUND(SUM(X.COSTO),2) AS costo
    ,(ROUND(SUM(X.IMP_NETO),2)-ROUND(SUM(X.COSTO),2)) AS importeUtilidad
    ,IFNULL( ((ROUND(SUM(X.IMP_NETO),2)-ROUND(SUM(X.COSTO),2))*100)/ROUND(SUM(X.IMP_NETO),2), 0.0) AS porcentajeUtilidad
    ,ROUND((X.KILOS),2) AS kilos
    ,IFNULL( ROUND(SUM(X.IMP_NETO)/(X.KILOS),2), 0.0) AS precioKilos
    ,IFNULL( ROUND(SUM(X.COSTO)/(X.KILOS),2), 0.0) AS costoKilos
    ,(CASE WHEN X.TIPO='EXI' THEN 0 ELSE SUM(X.INV_COSTO) END) AS inventarioCosteado
    ,SUM(X.KILOS_INV) AS kilosInv
    FROM (
    SELECT '@MES - @YEAR' AS PERIODO
    ,@DESCRIPCION  AS DESCRIP
    ,SUM(D.IMP_NETO) AS IMP_NETO
    ,SUM(D.COSTO_NETO / D.FACTORU) AS COSTO
    ,0.0 AS INV_COSTO
    ,SUM(D.KILOS) AS KILOS
    ,0 AS KILOS_INV
    FROM @BI_SCHEMA.FACT_VENTAS_DET D
    WHERE D.CLAVE<>'ANTICIPO' AND D.FECHA BETWEEN '@FECHA_INI' AND '@FECHA_FIN'
    @VENTA
    @TIPO_PROD
    GROUP BY DESCRIP
    UNION
    SELECT '@MES - @YEAR'  AS PERIODO
    ,@INVENTARIO  AS DESCRIP
    ,0.0 AS IMP_NETO
    ,0.0 AS COSTO
    ,ROUND(SUM(D.CANTIDAD/(case when p.unidad='MIL' then 1000 else 1 end)*D.COSTO_promedio),2) AS INV_COSTO
    ,0 AS KILOS
    ,sum(D.CANTIDAD/(case when p.unidad='MIL' then 1000 else 1 end)*P.KILOS) AS KILOS_INV
    FROM @PROD_SCHEMA.existencia D
    JOIN @PROD_SCHEMA.PRODUCTO P ON (P.ID=D.PRODUCTO_ID)
    JOIN @PROD_SCHEMA.linea L ON (L.ID=P.LINEA_ID)
    WHERE D.ANIO=YEAR('@FECHA_INI') AND D.MES=MONTH('@FECHA_FIN')
    @TIPO_PROD
    GROUP BY DESCRIP
    ) AS X GROUP BY X.DESCRIP
    """
  }


  String getSchema() {
    if(Environment.isDevelopmentMode()) {
      return 'siipapx_dev'
    } else return 'siipapx'
  }

  String getSchemaBi() {
    if(Environment.isDevelopmentMode()) {
      return 'bi'
    } else return 'bi'
  }


  def porLinea() {
    String select = """
      select year(fecha), month(fecha), linea, origen, sum(kilos) as kilos, sum(imp_neto) as venta, sum(costo) as costo
      from fact_ventas_det
      group by  year(fecha), month(fecha), linea, origen
    """
  }

}
