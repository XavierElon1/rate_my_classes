#!/usr/bin/env groovy
node('worker') {
    checkout scm
    stage('check npm') {
        sh 'npm --version'
    }
    stage('install service') {
        dir('ratemyclasses-svc') {
            sh 'npm install'
        }
    }
    stage('test service') {
        dir('ratemyclasses-svc') {
            sh './configure.sh'
            sh 'npm run test'
        }
    }
    stage('package service') {
        SHORT_COMMIT = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
        dir('ratemyclasses-svc') {
            sh """zip -r ${SHORT_COMMIT}.zip . -x '*.git*' '*test*' '*postman*' 'node_modules/mocha*' 'node_modules/chai*' """
        }
    }
    //s3Upload(file:'file.txt', bucket:'my-bucket', path:'path/to/target/file.txt')
}
