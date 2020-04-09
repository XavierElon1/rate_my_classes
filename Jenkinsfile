#!/usr/bin/env groovy
node('backendblue') {
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
            sh """zip -r ${SHORT_COMMIT}.zip . -x -q '*.git*' '*test*' '*postman*' 'node_modules/mocha*' 'node_modules/chai*' """
        }
    }
    stage('push artifact to s3') {
        SHORT_COMMIT = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
        dir('ratemyclasses-svc') {
            withAWS(credentials: 's3upload', region: 'us-east-2') {
                s3Upload(file:"${SHORT_COMMIT}.zip", bucket:'ratemyclasses-deploy', path:"${SHORT_COMMIT}.zip")
            }
        }
    }
}
