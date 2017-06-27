package com.ericsson.ema.timgui

import com.ericsson.ema.tim.context.TableInfoMap

/**
  * Created by eqinson on 2017/6/27.
  */
object Utils {
	def parseTable(table: String, fullResult: List[List[Object]]): (List[String], List[List[(String, String)]]) = {
		val listOfCol = TableInfoMap().lookupAll()(table).tableMetadata.keys.toList
		val listOfData = for (row <- fullResult)
			yield listOfCol.zip(
				for (col <- row) yield col.toString
			)

		(listOfCol, listOfData)
	}
}

object validTables {
	def isValid(table: String): Boolean = TableInfoMap().lookupAll().keys.toList.contains(table)
}
