import sbt._

object Dependencies {
	val scala_version = "2.11.7"
	val scalatraVersion = "2.5.0"
	val slf4jVersion = "1.7.22"
	val zkcache_version = "1.0"

	val joseJWT: ModuleID = "com.nimbusds" % "nimbus-jose-jwt" % "4.34.2"
	val slf4j: ModuleID = "org.slf4j" % "slf4j-api" % slf4jVersion
	val slf4j_log4j12: ModuleID = "org.slf4j" % "slf4j-log4j12" % slf4jVersion
	val slf4j_for_jcl: ModuleID = "org.slf4j" % "jcl-over-slf4j" % slf4jVersion
	val slf4j_nop: ModuleID = "org.slf4j" % "slf4j-nop" % slf4jVersion
	val scalaXML: ModuleID = "org.scala-lang.modules" %% "scala-xml" % "1.0.5"
	val scalatra: ModuleID = "org.scalatra" %% "scalatra" % scalatraVersion
	val scalatraJSON: ModuleID = "org.scalatra" %% "scalatra-json" % scalatraVersion
	val scalatraAuth: ModuleID = "org.scalatra" %% "scalatra-auth" % scalatraVersion
	val playJSON: ModuleID = "com.typesafe.play" %% "play-json" % "2.5.12"
	val httpClient: ModuleID = "org.apache.httpcomponents" % "fluent-hc" % "4.5" exclude("commons-logging", "commons-logging")
	val zkcache: ModuleID = "com.ericsson.ema" % "zkcache" % zkcache_version

	val javax: ModuleID = "javax.servlet" % "javax.servlet-api" % "3.1.0"

	val commonDependencies: Seq[ModuleID] = Seq(
		joseJWT % Provided,
		slf4j_for_jcl % Provided,
		scalaXML % Provided,
		scalatra,
		scalatraJSON,
		scalatraAuth,
		playJSON,
		httpClient % Provided,
		javax % Provided,
		zkcache
	).map(_
		exclude("log4j", "log4j")
		exclude("org.slf4j", "slf4j-log4j12")
		exclude("org.slf4j", "slf4j-api")
		excludeAll ExclusionRule("org.scala-lang")
	) :+ slf4j % Provided

	val modelDependencies: Seq[ModuleID] = Seq()
	val serviceDependencies: Seq[ModuleID] = Seq()
	val webDependencies: Seq[ModuleID] = Seq()
}
