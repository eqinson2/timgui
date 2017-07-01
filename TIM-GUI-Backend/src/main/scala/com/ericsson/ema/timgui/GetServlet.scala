package com.ericsson.ema.timgui

import com.ericsson.ema.tim.context.TableInfoMap
import com.ericsson.ema.tim.dml.{Select, Selector}
import org.scalatra.{BadRequest, InternalServerError, Ok, ScalatraServlet}
import org.slf4j.{Logger, LoggerFactory}
import play.api.libs.json.{JsValue, Json}

/**
  * Created by eqinson on 2017/6/26.
  */
class GetServlet(tableInfo: TableInfoMap, selector: Option[Selector] = None) extends ScalatraServlet with JsonErrorMessage {
	private val logger: Logger = LoggerFactory.getLogger(getClass)

	private val defaultHeader = Map("Content-Type" -> "application/json;UTF-8")

	get("/:tableName") {
		params.get("tableName") match {
			case Some("listAll") =>
				val listOfTable = tableInfo.lookupAllTableName()
				val json: JsValue = Json.obj("tables" -> listOfTable)

				logger.info("listAll table: " + json.toString())
				Ok(Json.stringify(json), defaultHeader)

			case Some(table) if validTables.isValid(tableInfo, table) =>
				logger.info("Try to get " + table + " with condition " + params.filter(_._1 != "tableName"))
				val fields = tableInfo.lookup(table).map(_.tableMetadata.keys.toList)
				fields match {
					case Some(f) =>
						val fullResult: List[List[Object]] = selector.getOrElse(Select(f: _*)).from(table).collectBySelectFields()
						val (listOfCol, listOfData) = Utils.parseTable(tableInfo, table, fullResult)
						val contents = listOfData.map(l => Json.toJson(l.toMap))

						val json: JsValue = Json.obj(
							"tableName" -> table,
							"tableHeader" -> listOfCol,
							"tableContents" -> contents)

						logger.info("Get reply with: " + Json.prettyPrint(json))
						Ok(Json.stringify(json), defaultHeader)

					case None =>
						logger.error(s"unexpected table: $table in zkcache when get table")
						InternalServerError(body = jsonResponse("500", s"unexpected table: $table in zkcache when get table"), headers = defaultHeader)
				}

			case Some(table) if !validTables.isValid(tableInfo, table) =>
				logger.error(s"illegal table name $table in get request")
				BadRequest(body = jsonResponse("400", s"illegal table name $table in get request"), reason = "Bad Request")

			case None =>
				logger.error("illegal get request")
				BadRequest(body = jsonResponse("400", "illegal get request"), reason = "Bad Request")
		}
	}
}