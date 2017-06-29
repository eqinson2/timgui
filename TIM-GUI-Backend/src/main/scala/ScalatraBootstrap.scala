/*
 * Created : 12/28/16
 *
 * Copyright (c) 2016 Ericsson AB, Sweden.
 * All rights reserved.
 * The Copyright to the computer program(s) herein is the property of Ericsson AB, Sweden.
 * The program(s) may be used and/or copied with the written permission from Ericsson AB
 * or in accordance with the terms and conditions stipulated in the agreement/contract
 * under which the program(s) have been supplied.
 */

import javax.servlet.ServletContext

import com.ericsson.ema.tim.context.TableInfoMap
import com.ericsson.ema.tim.zookeeper.{ZKConnectionManager, ZKMonitor}
import com.ericsson.ema.timgui._
import org.scalatra._
import org.slf4j.LoggerFactory

/**
  * 1、POST    /url      create
  * 2、DELETE  /url/xxx  delete
  * 3、PUT     /url/xxx  update
  * 4、GET     /url/xxx  get
  */
class ScalatraBootstrap extends LifeCycle {
	private val logger = LoggerFactory.getLogger("ScalatraBootstrap")

	private val BASE_URI = "/timgui-backend/tables"

	private var zkm: ZKConnectionManager = _

	private var zkMonitor: ZKMonitor = _


	override def init(context: ServletContext): Unit = {
		context.setInitParameter(ScalatraBase.ForceHttpsKey, "true")

		zkm = ZKConnectionManager()
		zkm.init()
		zkMonitor = new ZKMonitor(zkm)
		zkMonitor.start()

		val tableInfo = TableInfoMap()
		mountAllServlet(context, tableInfo)
	}

	def mountAllServlet(implicit context: ServletContext, tableInfo: TableInfoMap): Unit = {
		mount(new CreateServlet(tableInfo), BASE_URI + "/insert")
		mount(new DeleteServlet(tableInfo), BASE_URI + "/delete")
		mount(new SetServlet(tableInfo), BASE_URI + "/set")
		mount(new GetServlet(tableInfo), BASE_URI + "/get")
		mount(new FilterServlet(tableInfo), BASE_URI + "/filter")
	}


	override def destroy(context: ServletContext): Unit = {
		zkMonitor.stop()
		zkm.destroy()
	}

	private def mount(handler: Handler, urlPattern: String)(implicit context: ServletContext): Unit = {
		logger.debug(s"Mounting [${handler.getClass.getName}] to path [$urlPattern]")
		context.mount(handler, urlPattern, 1)
	}
}
