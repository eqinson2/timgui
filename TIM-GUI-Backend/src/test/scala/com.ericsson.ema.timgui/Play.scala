package com.ericsson.ema.timgui

import play.api.libs.json.{JsValue, Json}

/**
  * Created by eqinson on 2017/6/26.
  */
object Play extends App {
	val map1 = Map(("1", "2"), ("3", "4"))
	val map2 = Map(("5", "6"), ("7", "8"))
	val list = List(map1, map2)
	val contents = list.map(Json toJson _)
	val json: JsValue = Json.obj(
		"tableName" -> "AAA",
		"tableContents" -> contents
	)

	println(json.toString())

}
