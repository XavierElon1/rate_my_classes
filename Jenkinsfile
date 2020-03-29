#!/usr/bin/env groovy
node('worker') {
    checkout scm
    stage('check npm') {
        sh 'npm --version'
    }
    stage('npm install') {
        println ''
        sh 'npm install'
    }
    stage('build') {
        sh 'echo building'
    }
}
