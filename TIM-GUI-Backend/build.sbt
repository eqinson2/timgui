import Dependencies._

lazy val `sbt-release` = project in file(".")

name := "tim-gui-backend"
organization := "com.ericsson.ema"
scalaVersion in ThisBuild := scala_version

// This forces the compiler to create a jar for this project and include that in the classpath
// If not set the compiler will use the classes directly
// This is needed in order to easily copy all jars when creating the tar.gz
exportJars := true

autoScalaLibrary in ThisBuild := false

// Needed to make sbt release work when use sbt 0.13+
updateOptions := updateOptions.value.withCachedResolution(!Option(System.getProperty("skipwithCachedResolution")).isDefined)

//---------------------------------------
// Enable Jetty for direct testing of web app in SBT
// jetty:start/stop
//---------------------------------------
enablePlugins(JettyPlugin)
containerLibs in Jetty ++= Seq(slf4j_log4j12)

disablePlugins(ModuleTarPlugin)

//---------------------------------------
// Compiler directives
//---------------------------------------
// this disables appending the scala version to the produced binary when deployed to binary repo
crossPaths in ThisBuild := false

// allow circular dependencies for test sources
compileOrder in Test := CompileOrder.Mixed

javacOptions ++= Seq("-source", "1.8", "-target", "1.8", "-Xlint")
// TODO: add -Xfatal-warnings when all warnings are fixed
scalacOptions ++= Seq("-deprecation", "-unchecked", "-feature", "-language:implicitConversions", "-language:higherKinds", "-target:jvm-1.8", "-encoding", "UTF-8", "-Xlint", "-Yno-adapted-args", "-Ywarn-numeric-widen", "-Xfuture")

//---------------------------------------
// Configure the needed settings to be able to publish artifacts to the binary repository (e.g. ARM)
// Settings:
// * The credentials to use when publishing artifacts
// * The URL where to deploy to
// * The URL to our own Nexus/ARM servers
//---------------------------------------
import com.ericsson.activation.sbt.plugin.ARMSettings
import org.dmonix.sbt.CredentialsSettings

publishArtifact in ThisBuild := false
publishArtifact := true

credentials ++= CredentialsSettings.publishCredentials
publishTo := ARMSettings.deployURL(version.value)
resolvers in ThisBuild ++= ARMSettings.resolverURLs

val testAndCompile = "test->test;compile->compile"
// A configuration which is like 'compile' except it performs additional static analysis.
// Execute static analysis via `lint:compile`
val LintTarget = config("lint").extend(Compile)

libraryDependencies in ThisBuild ++= commonDependencies


lazy val `tim-gui-backend`: Project = project.in(file("."))
	.settings(Commons.settings: _*)
	.disablePlugins(ModuleTarPlugin)
	.configs(LintTarget)

addMainSourcesToLintTarget()

addSlowScalacSwitchesToLintTarget()

addWartRemoverToLintTarget()

removeWartRemoverFromCompileTarget()

addFoursquareLinterToLintTarget()

removeFoursquareLinterFromCompileTarget()

removeFatalWarningsFromLintTarget()

removeScalacSwitchesFromTestTarget()

def addMainSourcesToLintTarget() = {
	inConfig(LintTarget) {
		// I posted http://stackoverflow.com/questions/27575140/ and got back the bit below as the magic necessary
		// to create a separate lint target which we can run slow static analysis on.
		Defaults.compileSettings ++ Seq(
			sources in LintTarget := {
				val lintSources = (sources in LintTarget).value
				lintSources ++ (sources in Compile).value
			}
		)
	}
}

def addSlowScalacSwitchesToLintTarget() = {
	inConfig(LintTarget) {
		// In addition to everything we normally do when we compile, we can add additional scalac switches which are
		// normally too time consuming to run.
		scalacOptions in LintTarget ++= Seq(
			// As it says on the tin, detects unused imports. This is too slow to always include in the build.
			"-Ywarn-unused-import",
			//This produces errors you don't want in development, but is useful.
			"-Ywarn-dead-code"
		)
	}
}

def addWartRemoverToLintTarget() = {
	import wartremover._
	// I didn't simply include WartRemove in the build all the time because it roughly tripled compile time.
	inConfig(LintTarget) {
		val fixedWarts = Seq(Wart.Any2StringAdd, Wart.EitherProjectionPartial, Wart.Return)
		Seq(
			wartremoverErrors ++= fixedWarts,
			// Warn for all unsafe warts but remove throw, nonunitstatements and all warts reported as error
			wartremoverWarnings ++= Warts.unsafe.filterNot(_ == Wart.Throw).filterNot(_ == Wart.NonUnitStatements).filterNot(_ == Wart.Var).filterNot(_ == Wart.Any).filterNot(fixedWarts.contains(_))
		)
	}
}

def removeFatalWarningsFromLintTarget() = {
	inConfig(LintTarget) {
		scalacOptions in LintTarget := ((scalacOptions in LintTarget).value filterNot (switch => switch.startsWith("-Xfatal-warnings"))) // remove-Xfatal-warnings
	}
}

def removeWartRemoverFromCompileTarget() = {
	// WartRemover's sbt plugin calls addCompilerPlugin which always adds directly to the Compile configuration.
	// The bit below removes all switches that could be passed to scalac about WartRemover during a non-lint compile.
	scalacOptions in Compile := (scalacOptions in Compile).value filterNot { switch =>
		switch.startsWith("-P:wartremover:") ||
			"^-Xplugin:.*/org[.]brianmckenna/.*wartremover.*[.]jar$".r.pattern.matcher(switch).find
	}
}

def addFoursquareLinterToLintTarget() = {
	Seq(
		addCompilerPlugin("org.psywerx.hairyfotr" %% "linter" % "0.1.14"),
		// See https://github.com/HairyFotr/linter#list-of-implemented-checks for a list of checks that foursquare linter
		// implements
		// By default linter enables all checks.
		// I don't mind using match on boolean variables.
		scalacOptions in LintTarget += "-P:linter:disable:PreferIfToBooleanMatch"
	)
}

def removeFoursquareLinterFromCompileTarget() = {
	// We call addCompilerPlugin in project/plugins.sbt to add a depenency on the foursquare linter so that sbt magically
	// manages the JAR for us.  Unfortunately, addCompilerPlugin also adds a switch to scalacOptions in the Compile config
	// to load the plugin.
	// The bit below removes all switches that could be passed to scalac about Foursquare Linter during a non-lint compile.
	scalacOptions in Compile := (scalacOptions in Compile).value filterNot { switch =>
		switch.startsWith("-P:linter:") ||
			"^-Xplugin:.*/org[.]psywerx[.]hairyfotr/.*linter.*[.]jar$".r.pattern.matcher(switch).find
	}
}

def removeScalacSwitchesFromTestTarget() = {
	scalacOptions in Test := (scalacOptions in Test).value filterNot { switch =>
		switch.startsWith("-Xfatal-warnings") || switch.startsWith("-Xlint") || switch.startsWith("-Yno-adapted-args") || switch.startsWith("-P:wartremover:") ||
			"^-Xplugin:.*/org[.]brianmckenna/.*wartremover.*[.]jar$".r.pattern.matcher(switch).find || switch.startsWith("-P:linter:") ||
			"^-Xplugin:.*/org[.]psywerx[.]hairyfotr/.*linter.*[.]jar$".r.pattern.matcher(switch).find
	}
}
