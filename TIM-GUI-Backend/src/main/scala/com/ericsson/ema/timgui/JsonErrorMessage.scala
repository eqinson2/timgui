package com.ericsson.ema.timgui

/**
  * Created by eqinson on 2017/6/27.
  */
trait JsonErrorMessage {

	def jsonResponse(code: String, errorMessage: String): String = {
		s"""{"code": $code, "error" : "$errorMessage"}"""
	}
}