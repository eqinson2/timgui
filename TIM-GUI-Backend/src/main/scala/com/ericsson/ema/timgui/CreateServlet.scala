package com.ericsson.ema.timgui

import com.ericsson.ema.tim.context.TableInfoMap
import com.ericsson.ema.tim.dml.Insert
import org.scalatra.{BadRequest, InternalServerError, NoContent, ScalatraServlet}
import org.slf4j.{Logger, LoggerFactory}

import scala.util.{Failure, Success, Try}

/**
  * Created by eqinson on 2017/6/26.
  */
class CreateServlet(private[this] val tableInfo: TableInfoMap) extends ScalatraServlet with JsonErrorMessage {
	private val logger: Logger = LoggerFactory.getLogger(getClass)

	private val defaultHeader = Map("Content-Type" -> "application/json;UTF-8")

	post("/:tableName") {
		params.get("tableName") match {
			case Some(table) if validTables.isValid(tableInfo, table) =>
				val fields = tableInfo.lookup(table).map(_.tableMetadata.keys.toList)
				fields match {
					case Some(_) =>
						val inserter = Insert().into(table)

						//	for ((newField, newValue) <- Json.parse(request.body).validate[Map[String, String]].get
						for ((newField, newValue) <- params if newValue != "")
							inserter.add(newField, newValue)

						Try(inserter.execute()) match {
							case Success(_)  => NoContent
							case Failure(ex) => BadRequest(body = jsonResponse("500", "insert into table failed"), reason = ex.getMessage)
						}

					case None =>
						InternalServerError(body = jsonResponse("500", s"unexpected table: $table in zkcache when insert table"), headers = defaultHeader)
				}

			case Some(table) if !validTables.isValid(tableInfo, table) =>
				BadRequest(body = jsonResponse("400", s"illegal table name: $table in insert request"), reason = "Bad Request")

			case None =>
				BadRequest(body = jsonResponse("400", "illegal insert request"), reason = "Bad Request")
		}
	}
}
