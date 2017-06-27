package com.ericsson.ema.timgui

import com.ericsson.ema.tim.context.TableInfoMap
import com.ericsson.ema.tim.dml.Select
import org.scalatra.{BadRequest, InternalServerError, Ok, ScalatraServlet}
import org.slf4j.{Logger, LoggerFactory}
import play.api.libs.json.{JsValue, Json}

/**
  * Created by eqinson on 2017/6/26.
  */
class GetServlet extends ScalatraServlet with JsonErrorMessage {
	private val logger: Logger = LoggerFactory.getLogger(getClass)

	private val defaultHeader = Map("Content-Type" -> "application/json;UTF-8")

	get("/:tableName") {
		params.get("tableName") match {
			case Some("listAll") =>
				val listOfTable = TableInfoMap().lookupAll().keys.toList
				val json: JsValue = Json.obj("tables" -> listOfTable)
				Ok(json, defaultHeader)

			case Some(table) if validTables.isValid(table) =>
				val fields = TableInfoMap().lookup(table).map(_.tableMetadata.keys.toList)
				fields match {
					case Some(f) =>
						val fullResult: List[List[Object]] = Select(f: _*).from(table).collectBySelectFields()
						val (listOfCol, listOfData) = Utils.parseTable(table, fullResult)
						val contents = listOfData.map(l => Json.toJson(l.toMap))

						val json: JsValue = Json.obj(
							"tableName" -> table,
							"tableHander" -> listOfCol,
							"tableContents" -> contents)

						Ok(json, defaultHeader)

					case None =>
						InternalServerError(body = jsonResponse("500", s"unexpected table: $table in zkcache when get table"), headers = defaultHeader)
				}

			case Some(table) if !validTables.isValid(table) =>
				BadRequest(body = jsonResponse("400", s"illegal table name: $table in get request"), reason = "Bad Request")

			case None =>
				BadRequest(body = jsonResponse("400", "illegal get request"), reason = "Bad Request")
		}
	}
}