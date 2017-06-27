#!/bin/bash
# This script cleans and packages the web app and then copies the .war file to the Tomcat deploy directory.

sbt package
cp target/*.war ${TOMCAT_HOME}/webapps/tim-gui-backend-1.0.war
