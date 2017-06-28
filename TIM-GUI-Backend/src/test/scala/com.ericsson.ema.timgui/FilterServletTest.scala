package com.ericsson.ema.timgui

import com.ericsson.ema.tim.context.{TableInfoContext, TableInfoMap}
import org.scalamock.scalatest.MockFactory
import org.scalatest.{BeforeAndAfter, FunSuiteLike}
import org.scalatra.test.scalatest.ScalatraSuite
import play.api.libs.json.Json

import scala.collection.mutable
import scala.language.implicitConversions

class FilterServletTest extends ScalatraSuite with BeforeAndAfter with FunSuiteLike with MockFactory {
	private val tableInfoMapLookupMock = stub[TableInfoMap]
	private val selectorMock = new SelectorMock
	private val listOfTab = List[String]("AAA", "BBB", "CCC")
	private val tableMetadata = mutable.LinkedHashMap[String, String]("name" -> "string", "age" -> "int", "job" -> "string", "hometown" -> "string")
	private val context = TableInfoContext(new Object, tableMetadata)

	addServlet(new FilterServlet(tableInfoMapLookupMock, Some(selectorMock)), "/*")

	test("FilterAAA") {
		tableInfoMapLookupMock.lookup _ when "AAA" returns Some(context)
		(tableInfoMapLookupMock.lookupAllTableName _).when.returns(listOfTab)

		val name = ("name", "eqinson1")
		val age = ("age", "11")
		val job = ("job", "software engineer")
		val hometown = ("hometown", "SH")
		val params = Seq(name, age, job, hometown)

		get("/AAA", params) {
			print(Json.prettyPrint(Json.parse(body)))
			status should be(200)
		}
	}
}
