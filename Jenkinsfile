
pipeline {
    agent any
    environment {
        NODE_VERSION = '24.x'
    }
    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                bat '''
                    npm ci
                    npx playwright install
                '''
            }
        }
        stage('Run Playwright Tests (Headed)') {
            steps {
                bat '''
                    npx playwright test --workers=4 --reporter=html || exit /b %ERRORLEVEL%
                '''
            }
        }
        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                junit 'playwright-report/**/*.xml'
            }
        }
    }
    post {
        always {
            echo "Pipeline finished. Check artifacts and test reports."
        }
        success { echo ":white_check_mark: Jenkins tests passed!" }
        failure { echo ":x: Jenkins tests failed!" }
    }
}


