package com.ericsson.ema.timgui

import com.ericsson.ema.tim.context.TableInfoMap
import com.ericsson.ema.tim.dml.Update
import com.ericsson.ema.tim.dml.predicate.Eq
import org.scalatra.{BadRequest, InternalServerError, NoContent, ScalatraServlet}
import org.slf4j.{Logger, LoggerFactory}
import play.api.libs.json.Json

import scala.util.{Failure, Success, Try}

/**
  * Created by eqinson on 2017/6/26.
  */
class SetServlet(private[this] val tableInfo: TableInfoMap, updater: Option[Update] = None) extends ScalatraServlet with JsonErrorMessage {
	private val logger: Logger = LoggerFactory.getLogger(getClass)

	private val defaultHeader = Map("Content-Type" -> "application/json;UTF-8")

	put("/:tableName") {
		params.get("tableName") match {
			case Some(table) if validTables.isValid(tableInfo, table) =>
				val fields = tableInfo.lookup(table).map(_.tableMetadata.keys.toList)

				fields match {
					case Some(f) =>
						val json = Json.parse(request.body)
						val oldData = (json \ "oldData").validate[Map[String, String]].get
						val newData = (json \ "newData").validate[Map[String, String]].get

						val upd = updater.getOrElse(Update()).into(table)

						for ((newField, newValue) <- newData; if newValue != "")
							upd.set(newField, newValue)

						for ((oldField, oldValue) <- oldData)
							upd.where(Eq(oldField, oldValue))

						Try(upd.execute()) match {
							case Success(_)  => NoContent
							case Failure(ex) => BadRequest(body = jsonResponse("500", "update into table failed"), reason = ex.getMessage)
						}
					case None    =>
						InternalServerError(body = jsonResponse("500", s"unexpected table: $table in zkcache when set table"), headers = defaultHeader)
				}

			case Some(table) if !validTables.isValid(tableInfo, table) =>
				BadRequest(body = jsonResponse("400", s"illegal table name: $table in set request"), reason = "Bad Request")

			case None =>
				BadRequest(body = jsonResponse("400", "illegal set request"), reason = "Bad Request")
		}
	}
}
