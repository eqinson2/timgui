package com.ericsson.ema.timgui

import com.ericsson.ema.tim.context.TableInfoMap
import com.ericsson.ema.tim.dml.Delete
import com.ericsson.ema.tim.dml.predicate.Eq
import org.scalatra.{BadRequest, InternalServerError, NoContent, ScalatraServlet}
import org.slf4j.{Logger, LoggerFactory}

import scala.util.{Failure, Success, Try}

/**
  * Created by eqinson on 2017/6/26.
  */
class DeleteServlet(private[this] val tableInfo: TableInfoMap) extends ScalatraServlet with JsonErrorMessage {
	private val logger: Logger = LoggerFactory.getLogger(getClass)

	private val defaultHeader = Map("Content-Type" -> "application/json;UTF-8")

	delete("/:tableName") {
		params.get("tableName") match {
			case Some(table) if validTables.isValid(tableInfo, table) =>
				logger.info("Try to delete " + table + " with condition " + params.filter(_._1 != "tableName"))
				val fields = tableInfo.lookup(table).map(_.tableMetadata.keys.toList)
				fields match {
					case Some(_) =>
						val deleter = Delete().from(table)

						for ((newField, newValue) <- params.filter(_._1 != "tableName") if newValue != "")
							deleter.where(Eq(newField, newValue))

						Try(deleter.execute()) match {
							case Success(_)  => NoContent
							case Failure(ex) =>
								logger.error("delete from table failed: " + ex.getMessage)
								BadRequest(body = jsonResponse("500", "delete from table failed: " + ex.getMessage), reason = ex.getMessage)
						}

					case None =>
						logger.error(s"unexpected table: $table in zkcache when delete table")
						InternalServerError(body = jsonResponse("500", s"unexpected table: $table in zkcache when delete table"), headers = defaultHeader)
				}

			case Some(table) if !validTables.isValid(tableInfo, table) =>
				logger.error(s"illegal table name: $table in delete request")
				BadRequest(body = jsonResponse("400", s"illegal table name: $table in delete request"), reason = "Bad Request")

			case None =>
				logger.error("illegal delete request")
				BadRequest(body = jsonResponse("400", "illegal delete request"), reason = "Bad Request")
		}
	}

}
