package com.ericsson.ema.timgui

import com.ericsson.ema.tim.dml.Selector
import com.ericsson.ema.tim.dml.predicate.PredicateClause

/**
  * Created by eqinson on 2017/6/28.
  */
class SelectorMock extends Selector {
	override def from(tab: String): Selector = {
		this
	}

	override def where(predicate: PredicateClause): Selector = this

	override def limit(limit: Int): Selector = this

	override def skip(skip: Int): Selector = this

	override def collect(): List[Object] = List[Object]()

	override def collectBySelectFields(): List[List[Object]] = {
		val data1 = List("eqinson1", "10", "software engineer", "SH")
		val data2 = List("eqinson2", "20", "support engineer", "BJ")
		val data3 = List("eqinson3", "26", "HR", "BJ")
		data1 :: data2 :: data3 :: Nil
	}

	override def count(): Long = 100

	override def exists(): Boolean = true

	override def orderBy(field: String, asc: String): Selector = this

	override def groupBy(field: String): Selector = this

	override def collectByGroup(): Map[Object, List[Object]] = Map[Object, List[Object]]()
}
