#!/usr/bin/env groovy
node('backendblue') {
    checkout scm
        //get list of dirs that changed from git
    if (sh(script: "echo $BRANCH_NAME | grep \"^PR-*\"", returnStatus: true) == 0) {
      affectedDirs = sh(returnStdout: true, script: '''git diff --name-only --dirstat=files,0 origin/master | awk 'BEGIN { FS = "/" } ; { print $1 }' | uniq
      ''').trim()
    } else {
      affectedDirs = sh(returnStdout: true, script: '''git diff --name-only --dirstat=files,0 HEAD~1 |  awk 'BEGIN {FS = "/"} ; {print $1}' | uniq
      ''').trim()
    }
    if (scm.branches[0].name == 'jenkinsTest') {
        println "TEST: Overriding logic to build all directories"
        affectedDirs = 'ratemyclasses-svc ratemyclasses-app'
    } else {
        println "Identified changes in the following:"
        println (affectedDirs)
    }

    if (affectedDirs.contains('ratemyclasses-svc')) {
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
                sh """zip -r ratemyclasses-svc_${SHORT_COMMIT}.zip . -x -q '*.git*' '*test*' '*postman*' 'node_modules/mocha*' 'node_modules/chai*' """
            }
        }
        stage('push service artifact to s3') {
            SHORT_COMMIT = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
            if (scm.branches[0].name == 'master') {
                dir('ratemyclasses-svc') {
                    withAWS(credentials: 's3upload', region: 'us-east-2') {
                        s3Upload(file:"ratemyclasses-svc_${SHORT_COMMIT}.zip", bucket:'ratemyclasses-deploy', path:"${SHORT_COMMIT}.zip")
                    }
                    sh 'rm -rf *.zip'
                }
            } else {
                sh 'echo "skipping publishing for non-master branches"'
            }
        }
        stage('deploy service') {
            SHORT_COMMIT = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
            if (scm.branches[0].name == 'master') {
                dir('ratemyclasses-svc') {
                    sh 'pm2 delete ratemyclasses-svc || true'
                    sh 'pm2 start server.js --name ratemyclasses-svc'
                    sh 'pm2 save'
                }
            } else {
                sh 'echo "skipping deployment for non-master branches"'
            }
        }
    }

    if (affectedDirs.contains('ratemyclasses-app')) {
        stage('check npm') {
            sh 'npm --version'
        }

        stage('install app') {
            dir('ratemyclasses-app') {
                sh 'npm install'
            }
        }

        stage('test app') {
            dir('ratemyclasses-app') {
                //sh './node_modules/react-scripts/bin/react-scripts.js test'
            }
        }

        stage('build app') {
            dir('ratemyclasses-app') {
                sh './node_modules/react-scripts/bin/react-scripts.js build'
            }
        }

        stage('package app') {
            SHORT_COMMIT = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
            dir('ratemyclasses-app/build') {
                sh """zip -r ratemyclasses-app_${SHORT_COMMIT}.zip . -q"""
            }
        }

        stage('push app artifact to s3') {
            SHORT_COMMIT = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
            if (scm.branches[0].name == 'master') {
                dir('ratemyclasses-app/build') {
                    withAWS(credentials: 's3upload', region: 'us-east-2') {
                        s3Upload(file:"ratemyclasses-app_${SHORT_COMMIT}.zip", bucket:'ratemyclasses-deploy', path:"${SHORT_COMMIT}.zip")
                    }
                    sh 'rm -rf *.zip'
                }
            } else {
                sh 'echo "skipping publishing for non-master branches"'
            }
        }

        stage('deploy app') {
            SHORT_COMMIT = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
            if (scm.branches[0].name == 'master') {
                dir('ratemyclasses-app') {
                    sh 'pm2 delete ratemyclasses-app || true'
                    sh 'pm2 start server.js --name ratemyclasses-app'
                    sh 'pm2 save'
                }
            } else {
                sh 'echo "skipping deployment for non-master branches"'
            }
        }
        cleanWs()
    }
}