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
}
