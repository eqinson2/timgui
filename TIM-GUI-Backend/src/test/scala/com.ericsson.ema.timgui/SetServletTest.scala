package com.ericsson.ema.timgui

import com.ericsson.ema.tim.context.{TableInfoContext, TableInfoMap}
import com.ericsson.ema.tim.dml.Update
import org.scalamock.scalatest.MockFactory
import org.scalatest.{BeforeAndAfter, FunSuiteLike}
import org.scalatra.test.scalatest.ScalatraSuite

import scala.collection.mutable
import scala.language.implicitConversions

class SetServletTest extends ScalatraSuite with BeforeAndAfter with FunSuiteLike with MockFactory {
	private val tableInfoMapLookupMock = stub[TableInfoMap]
	private val listOfTab = List[String]("AAA", "BBB", "CCC")
	private val tableMetadata = mutable.LinkedHashMap[String, String]("name" -> "string", "age" -> "int", "job" -> "string", "hometown" -> "string")
	private val context = TableInfoContext(new Object, tableMetadata)

	private val updaterMock = stub[Update]

	addServlet(new SetServlet(tableInfoMapLookupMock, Some(updaterMock)), "/*")

	test("SetAAA") {
		tableInfoMapLookupMock.lookup _ when "AAA" returns Some(context)
		(tableInfoMapLookupMock.lookupAllTableName _).when.returns(listOfTab)

		updaterMock.into _ when "AAA" returns updaterMock
		updaterMock.where _ when * returns updaterMock
		updaterMock.set _ when(*, *) returns updaterMock

		val name = ("name", "eqinson1")
		val age = ("age", "11")
		val job = ("job", "software engineer")
		val hometown = ("hometown", "SH")
		val params = Seq(name, age, job, hometown)

		val reqBody =
			"""{
			  |  "oldData" : {
			  |    "name" : "eqinson1",
			  |    "age" : "10",
			  |    "job" : "software engineer",
			  |    "hometown" : "SH"
			  |  },
			  |  "newData" : {
			  |    "name" : "eqinson2",
			  |    "age" : "12",
			  |    "job" : "test engineer",
			  |    "hometown" : "BJ"
			  |  }
			  |}""".stripMargin.getBytes()

		put("/AAA", reqBody) {
			status should be(200)
		}
	}
}
