package sx.cxc

import javax.sql.DataSource

import groovy.sql.Sql
import groovy.util.logging.Slf4j
import groovy.transform.TypeCheckingMode

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import grails.gorm.transactions.NotTransactional


import sx.core.LogUser
import sx.core.Cliente
import sx.utils.MonedaUtils

@Slf4j
@GrailsCompileStatic
class AntiguedadService implements LogUser {

  DataSource dataSource;

  @Transactional
  List<AntiguedadPorCliente> generar(String tipo = 'CRE', Date fecha = new Date()) {
    log.info('Generando antiguedad: {}, Cartera: {}', fecha.format('dd/MM/yyyy'), tipo)
    AntiguedadPorCliente
      .executeUpdate("delete from AntiguedadPorCliente where fecha= :dia and tipo=:cartera",
      [dia: fecha, cartera: tipo])
    List<CuentaPorCobrar> rows = CuentaPorCobrar.findAll("""
      from CuentaPorCobrar c
        where c.saldoReal > 0.0
          and tipo = :cartera
          and c not in(select j.cxc from Juridico j)
      """ ,[cartera: tipo])
    Double saldoTotal = rows.sum(0.0, {it.saldo}) as Double
    return rows.groupBy{it.cliente}.collect { entry ->
      Cliente cte = entry.key
      List<CuentaPorCobrar> facturas = entry.value.sort{it.fecha}
      return generarAntiguedadPorCliente(facturas, cte, 'CRE', new Date(), saldoTotal)
    }
  }


  @Transactional()
  @GrailsCompileStatic(TypeCheckingMode.SKIP)
  AntiguedadPorCliente generarAntiguedadPorCliente(List<CuentaPorCobrar> rows, Cliente cte, String tipo, Date dia, Double saldoTotal = 0.0) {
    log.info('Generando Antigedad para  {} Facturas: {}', cte.nombre, rows.size())

    CuentaPorCobrar masAtrasada = rows.max{it.atrasoCalculado}
    Double saldoCte = rows.sum(0.0, {it.saldoReal})

    AntiguedadPorCliente antiguedad = AntiguedadPorCliente.findOrCreateWhere(fecha: dia, clienteId: cte.id, tipo: tipo)
    antiguedad.with {
      cliente = cte.nombre
      plazo = cte.credito.plazo
      limiteDeCredito = cte.credito.lineaDeCredito
      tipoVencimiento = cte.credito.venceFactura ? 'FAC' : 'REV'
      facturas = rows.size()
      total = rows.sum(0.0, {it.total})
      saldo = saldoCte
      vencido = rows.sum(0.0, {it.atrasoCalculado > 0 ? it.saldoReal : 0.0})
      porVencer = rows.sum(0.0, {it.atrasoCalculado <= 0 ? it.saldoReal : 0.0})
      de1_30 = rows.sum(0.0, {(it.atrasoCalculado > 0 && it.atrasoCalculado <= 30)? it.saldoReal : 0.0})
      de31_60 = rows.sum(0.0, {(it.atrasoCalculado > 30 && it.atrasoCalculado <= 60)? it.saldoReal : 0.0})
      de61_90 = rows.sum(0.0, {(it.atrasoCalculado > 60 && it.atrasoCalculado <= 90)? it.saldoReal : 0.0})
      mas90 = rows.sum(0.0, {it.atrasoCalculado > 90 ? it.saldoReal : 0.0})
      atrasoMaximo = masAtrasada ? masAtrasada.atrasoCalculado : 0
      participacion = MonedaUtils.round(saldoCte / saldoTotal , 4)
    }
    logEntity(antiguedad)
    antiguedad = antiguedad.save failOnError: true,flush: true
    return antiguedad
  }

  @NotTransactional
  def List antiguedad() {
    Sql sql = new Sql(dataSource);
    return sql.rows(query);
  }

  String getQuery() {
    return """
    SELECT X.ID as clienteId, X.NOMBRE as cliente,C.PLAZO as plazo,C.linea_de_credito AS limiteDeCredito,CASE WHEN C.VENCE_FACTURA IS FALSE THEN 'REV' ELSE 'FAC' END AS tipoVencimiento,COUNT(F.ID) AS facturas
    ,MAX((CASE WHEN TO_DAYS(CURRENT_DATE)-TO_DAYS(F.VENCIMIENTO)>0 THEN TO_DAYS(CURRENT_DATE)-TO_DAYS(F.VENCIMIENTO) ELSE 0 END)) AS atrasoMaximo
    ,SUM((F.TOTAL-IFNULL((SELECT SUM(B.IMPORTE) FROM aplicacion_de_cobro B WHERE B.cuenta_por_cobrar_id=F.ID ),0) ) * F.tipo_de_cambio ) AS saldo
    ,SUM(CASE WHEN (TO_DAYS(CURRENT_DATE)-TO_DAYS(F.VENCIMIENTO))<1 THEN ((F.TOTAL-IFNULL((SELECT SUM(B.IMPORTE) FROM aplicacion_de_cobro B WHERE B.cuenta_por_cobrar_id=F.ID ),0) ) * F.tipo_de_cambio ) ELSE 0 END) AS porVencer
    ,SUM(CASE WHEN (TO_DAYS(CURRENT_DATE)-TO_DAYS(F.VENCIMIENTO))>0 THEN ((F.TOTAL-IFNULL((SELECT SUM(B.IMPORTE) FROM aplicacion_de_cobro B WHERE B.cuenta_por_cobrar_id=F.ID ),0) ) * F.tipo_de_cambio ) ELSE 0 END) AS vencido
    ,SUM(CASE WHEN (TO_DAYS(CURRENT_DATE)-TO_DAYS(F.VENCIMIENTO)) BETWEEN 1 AND 30 THEN ((F.TOTAL-IFNULL((SELECT SUM(B.IMPORTE) FROM aplicacion_de_cobro B WHERE B.cuenta_por_cobrar_id=F.ID ),0) ) * F.tipo_de_cambio ) ELSE 0 END)  AS de1_30
    ,SUM(CASE WHEN (TO_DAYS(CURRENT_DATE)-TO_DAYS(F.VENCIMIENTO)) BETWEEN 31 AND 60 THEN ((F.TOTAL-IFNULL((SELECT SUM(B.IMPORTE) FROM aplicacion_de_cobro B WHERE B.cuenta_por_cobrar_id=F.ID ),0) ) * F.tipo_de_cambio ) ELSE 0 END)  AS de31_60
    ,SUM(CASE WHEN (TO_DAYS(CURRENT_DATE)-TO_DAYS(F.VENCIMIENTO)) BETWEEN 61 AND 90 THEN ((F.TOTAL-IFNULL((SELECT SUM(B.IMPORTE) FROM aplicacion_de_cobro B WHERE B.cuenta_por_cobrar_id=F.ID ),0) ) * F.tipo_de_cambio ) ELSE 0 END)  AS de61_90
    ,SUM(CASE WHEN (TO_DAYS(CURRENT_DATE)-TO_DAYS(F.VENCIMIENTO))>90 THEN ((F.TOTAL-IFNULL((SELECT SUM(B.IMPORTE) FROM aplicacion_de_cobro B WHERE B.cuenta_por_cobrar_id=F.ID ),0) ) * F.tipo_de_cambio ) ELSE 0 END)  AS mas90
    ,SUM(((F.TOTAL-IFNULL((SELECT SUM(B.IMPORTE) FROM aplicacion_de_cobro B WHERE B.cuenta_por_cobrar_id=F.ID ),0) ) * F.tipo_de_cambio ))*100 /  ((SELECT SUM(((F.TOTAL-IFNULL((SELECT SUM(B.IMPORTE) FROM aplicacion_de_cobro B WHERE B.cuenta_por_cobrar_id=F.ID ),0) ) * F.tipo_de_cambio ))
        FROM cuenta_por_cobrar F JOIN cliente_credito C ON(F.cliente_id=C.cliente_id) WHERE F.FECHA>'2016/12/31'  AND  F.TIPO='CRE'  AND f.id not in(select j.cxc_id from juridico j where j.cxc_id=f.id) AND  (F.TOTAL-IFNULL((SELECT SUM(B.IMPORTE) FROM aplicacion_de_cobro B WHERE B.cuenta_por_cobrar_id=F.ID ),0))>0 )) AS part
    FROM  cuenta_por_cobrar F JOIN cliente_credito C ON(F.cliente_id=C.cliente_id) JOIN cliente X ON(F.CLIENTE_ID=X.ID)
    WHERE F.FECHA>'2017/01/01'  AND F.TIPO='CRE' AND f.id not in(select j.cxc_id from juridico j where j.cxc_id=f.id) and
    ((F.TOTAL-IFNULL((SELECT SUM(B.IMPORTE) FROM aplicacion_de_cobro B WHERE B.cuenta_por_cobrar_id=F.ID ),0) ) * F.tipo_de_cambio )<>0
    group by X.ID, C.PLAZO,C.linea_de_credito, C.VENCE_FACTURA
    """
  }

}
