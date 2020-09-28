package sx.integracion

import java.sql.SQLException
import javax.sql.DataSource

import groovy.sql.Sql
import groovy.util.logging.Slf4j

import groovy.transform.CompileStatic
import groovy.transform.TypeCheckingMode
import grails.compiler.GrailsCompileStatic

import org.apache.commons.lang.exception.ExceptionUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier

import sx.core.Sucursal

@Slf4j
@CompileStatic
trait Integracion {

  @Autowired
  @Qualifier('dataSource')
  DataSource dataSource


  List fetchRows(String sql, Map params) {
    Sql db = getSql()
    try {
      return db.rows(sql, params)
    }catch (SQLException e){
      Throwable c = ExceptionUtils.getRootCause(e)
      String message = ExceptionUtils.getRootCauseMessage(e)
      logError(message)
      throw new RuntimeException(message,c)
    }finally {
      db.close()
    }
  }

  Map fetchRow(String sql, Map  params){
    Sql db = getSql()
    return db.firstRow(sql, params)
  }

  Sql getSql(){
    Sql sql = new Sql(this.dataSource)
    return sql;
  }


  /**
  * Obtiene registros de una sucursal abriendo una conexion de SQL directa
  *
  */
  List getRowsFromSucursal(Sucursal sucursal, String sql, ...params) {
    Sql db = getSucursalSql(sucursal)
    try {
        return db.rows(sql,params)
    }catch (SQLException e){
        Throwable c = ExceptionUtils.getRootCause(e)
        String message = ExceptionUtils.getRootCauseMessage(e)
        logError(message)
        throw new RuntimeException(message,c)
    }finally {
        db.close()
    }
  }

  Sql getSucursalSql(Sucursal sucursal) {
    String user = 'root'
    String password = 'sys'
    String driver = 'com.mysql.jdbc.Driver'
    Sql db = Sql.newInstance(sucursal.dbUrl, user, password, driver)
    return db
  }

  @CompileStatic(TypeCheckingMode.SKIP)
  private void logError(String m) {
    log.error(m)
  }

}
