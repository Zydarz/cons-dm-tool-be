pipeline{
    agent{
        label 'workers'
    }

    environment {
       REGISTRY = credentials('dm-tool-registry')
       IMAGE_NAME = credentials("dm-tool-${env.BRANCH_NAME}-image")
       REGISTRY_CREDENTIALS = 'ecr:ap-southeast-1:dm-tool'
       CLIENT_SSH_CREDENTIALS = "dm-tool-${env.BRANCH_NAME}"
       MSTEAMS_HOOK = credentials('dm-tool-hook')
       SSH_USER_HOST = credentials("dm-tool-${env.BRANCH_NAME}-host-user")
       SSH_SCRIPT = credentials("dm-tool-${env.BRANCH_NAME}-script")
       SONARQUBE_PRJ = "dm-tool-be-${env.BRANCH_NAME}"
    }

    
    stages{
        stage('Checkout'){
            steps{
                checkout scm
            }
        }

        stage('Add Config files') {
            steps {
                configFileProvider([configFile(fileId: "dm-tool-${env.BRANCH_NAME}-env", targetLocation: '.env')]) {}
            }
        }

        stage('Build'){
            steps{
                script {
                    app = docker.build(env.IMAGE_NAME)
                }
            }
        }

        stage('Push to ECR') {
            steps {
                script{
                    sh ('rm -f ~/.dockercfg ~/.docker/config.json || true')
                    docker.withRegistry(env.REGISTRY, env.REGISTRY_CREDENTIALS) {
                        app.push("${env.BUILD_NUMBER}")
                        app.push("latest")
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                sshagent(credentials: [env.CLIENT_SSH_CREDENTIALS]) {
                    sh """
                        ssh -t -t ${env.SSH_USER_HOST} -o StrictHostKeyChecking=no "${env.SSH_SCRIPT}"
                    """
                }
            }
        }
    }

    post {
        success {
            office365ConnectorSend (
                status: "Build Success",
                webhookUrl: "${env.MSTEAMS_HOOK}",
                color: '00ff00',
                message: "Successful: ${JOB_NAME} - ${BUILD_DISPLAY_NAME}<br>Pipeline duration: ${currentBuild.durationString}"
            )
        }
        failure {
            office365ConnectorSend(
                status: "Build Failed",
                webhookUrl: "${env.MSTEAMS_HOOK}",
                color: 'ff4000',
                message: "The build has failed, please check build logs"
            )
        }
    }
}

def commitID() {
    sh 'git rev-parse HEAD > .git/commitID'
    def commitID = readFile('.git/commitID').trim()
    sh 'rm .git/commitID'
    commitID
}
