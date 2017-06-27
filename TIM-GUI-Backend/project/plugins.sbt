//Nexus is needed to get the ema-module-sbt-plugin.
val localNexus = "http://sekalx366.epk.ericsson.se:8081/nexus/content"
resolvers ++= Seq(
	"Local Nexus Snapshots" at localNexus + "/repositories/snapshots/",
	"Local Nexus Releases" at localNexus + "/repositories/releases/"
)

addSbtPlugin("com.typesafe.sbteclipse" % "sbteclipse-plugin" % "2.5.0")

addSbtPlugin("org.scoverage" % "sbt-scoverage" % "1.1.0")

addSbtPlugin("com.jsuereth" % "sbt-pgp" % "1.0.0")

addSbtPlugin("org.xerial.sbt" % "sbt-sonatype" % "0.5.1")

addSbtPlugin("com.github.gseitz" % "sbt-release" % "1.0.0")

addSbtPlugin("com.typesafe.sbt" % "sbt-native-packager" % "1.0.0")

addSbtPlugin("com.ericsson.activation" % "activation-sbt-plugins" % "0.5")

addSbtPlugin("net.virtual-void" % "sbt-dependency-graph" % "0.8.2")

addSbtPlugin("org.wartremover" % "sbt-wartremover" % "1.1.1")

addSbtPlugin("org.scalastyle" %% "scalastyle-sbt-plugin" % "0.8.0")

addSbtPlugin("com.earldouglas" % "xsbt-web-plugin" % "2.1.0")
addSbtPlugin("org.dmonix.sbt" % "sbt-scaladoc-settings-plugin" % "0.7")
addSbtPlugin("org.dmonix.sbt" % "sbt-publish-settings-plugin" % "0.5")
