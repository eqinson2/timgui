package com.ericsson.ema.timgui

import com.ericsson.ema.tim.context.TableInfoMap
import com.ericsson.ema.tim.dml.Select
import com.ericsson.ema.tim.dml.predicate.Eq
import org.scalatra.{BadRequest, InternalServerError, Ok, ScalatraServlet}
import org.slf4j.{Logger, LoggerFactory}
import play.api.libs.json.{JsValue, Json}

/**
  * Created by eqinson on 2017/6/26.
  */
class FilterServlet extends ScalatraServlet with JsonErrorMessage {
	private val logger: Logger = LoggerFactory.getLogger(getClass)

	private val defaultHeader = Map("Content-Type" -> "application/json;UTF-8")

	get("/:tableName") {
		params.get("tableName") match {
			case Some(table) if validTables.isValid(table) =>
				val fields = TableInfoMap().lookup(table).map(_.tableMetadata.keys.toList)
				fields match {
					case Some(f) =>
						val selector = Select(f: _*).from(table)

						for ((filterField, filterValue) <- Json.parse(request.body).validate[Map[String, String]].get
							 if filterValue != "")
							selector.where(Eq(filterField, filterValue))

						val fullResult: List[List[Object]] = selector.collectBySelectFields()
						val (listOfCol, listOfData) = Utils.parseTable(table, fullResult)
						val contents = listOfData.map(l => Json.toJson(l.toMap))

						val json: JsValue = Json.obj(
							"tableName" -> table,
							"tableHander" -> listOfCol,
							"tableContents" -> contents)

						Ok(json, defaultHeader)

					case None =>
						InternalServerError(body = jsonResponse("500", s"unexpected table: $table in zkcache when filter table"), headers = defaultHeader)
				}

			case Some(table) if !validTables.isValid(table) =>
				BadRequest(body = jsonResponse("400", s"illegal table name: $table in filter request"), reason = "Bad Request")

			case None =>
				BadRequest(body = jsonResponse("400", "illegal filter request"), reason = "Bad Request")
		}
	}
}