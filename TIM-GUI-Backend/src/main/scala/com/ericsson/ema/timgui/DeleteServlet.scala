package com.ericsson.ema.timgui

import com.ericsson.ema.tim.context.TableInfoMap
import com.ericsson.ema.tim.dml.Delete
import com.ericsson.ema.tim.dml.predicate.Eq
import org.scalatra.{BadRequest, InternalServerError, NoContent, ScalatraServlet}
import org.slf4j.{Logger, LoggerFactory}
import play.api.libs.json.Json

import scala.util.{Failure, Success, Try}

/**
  * Created by eqinson on 2017/6/26.
  */
class DeleteServlet extends ScalatraServlet with JsonErrorMessage {
	private val logger: Logger = LoggerFactory.getLogger(getClass)

	private val defaultHeader = Map("Content-Type" -> "application/json;UTF-8")

	delete("/:tableName") {
		params.get("tableName") match {
			case Some(table) if validTables.isValid(table) =>
				val fields = TableInfoMap().lookup(table).map(_.tableMetadata.keys.toList)
				fields match {
					case Some(_) =>
						val deleter = Delete().from(table)

						for ((newField, newValue) <- Json.parse(request.body).validate[Map[String, String]].get
							 if newValue != "")
							deleter.where(Eq(newField, newValue))

						Try(deleter.execute()) match {
							case Success(_)  => NoContent
							case Failure(ex) => BadRequest(body = jsonResponse("500", "delete from table failed"), reason = ex.getMessage)
						}

					case None =>
						InternalServerError(body = jsonResponse("500", s"unexpected table: $table in zkcache when delete table"), headers = defaultHeader)
				}

			case Some(table) if !validTables.isValid(table) =>
				BadRequest(body = jsonResponse("400", s"illegal table name: $table in delete request"), reason = "Bad Request")

			case None =>
				BadRequest(body = jsonResponse("400", "illegal delete request"), reason = "Bad Request")
		}
	}

}
