# Configuraicón CI/CD

En esta sección se especificarán los pasos necesarios para configurar el CI/CD en el repositorio.


### Agregar archivo .drone.yml

```yaml
kind: pipeline
name: oati_golang_api_ci

workspace:
  base: /go
  path: src/github.com/${DRONE_REPO}

steps:
- name: build
  image: golang:1.18
  commands:
    - go mod init
    - go get -t
    - GOOS=linux GOARCH=amd64 go build -o main
  when:
    branch:
      - develop
      - release/*
      - feature/*
      - master
    event:
      - push

- name: publish_to_ecr_release
  image: plugins/ecr
  settings:
    access_key:
      from_secret: AWS_ACCESS_KEY_ID
    secret_key:
      from_secret: AWS_SECRET_ACCESS_KEY
    region:
      from_secret: AWS_REGION
    repo: ${DRONE_REPO_NAME}
    tags:
      - ${DRONE_COMMIT:0:7}
      - release
  when:
    branch:
      - release/*
    event:
      - push

- name: publish_to_ecr_prod
  image: plugins/ecr
  settings:
    access_key:
      from_secret: AWS_ACCESS_KEY_ID
    secret_key:
      from_secret: AWS_SECRET_ACCESS_KEY
    region:
      from_secret: AWS_REGION
    repo: ${DRONE_REPO_NAME}
    tags:
      - ${DRONE_COMMIT:0:7}
      - latest
  when:
    branch:
      - master
    event:
      - push

- name: deploy_ecs_service_release
  image: joshdvir/drone-ecs-deploy
  settings:
    cluster: test
    service: ${DRONE_REPO_NAME}_test
    aws_region:
      from_secret: AWS_REGION
    aws_access_key_id:
      from_secret: AWS_ACCESS_KEY_ID
    aws_secret_access_key:
      from_secret: AWS_SECRET_ACCESS_KEY
    image_name: ${ECR_BASE_ARN}/${DRONE_REPO_NAME}
    image_tag: release
  environment:
    ECR_BASE_ARN:
      from_secret: ECR_BASE_ARN
  when:
    branch:
      - release/*
    event:
      - push

- name: deploy_ecs_service_prod
  image: joshdvir/drone-ecs-deploy
  settings:
    cluster: oas
    service: ${DRONE_REPO_NAME}_prod
    aws_region:
      from_secret: AWS_REGION
    aws_access_key_id:
      from_secret: AWS_ACCESS_KEY_ID
    aws_secret_access_key:
      from_secret: AWS_SECRET_ACCESS_KEY
    image_name: ${ECR_BASE_ARN}/${DRONE_REPO_NAME}
    image_tag: latest
  environment:
    ECR_BASE_ARN:
      from_secret: ECR_BASE_ARN
  when:
    branch:
      - master
    event:
      - push
```
### NOTA:

Esta **adición de código** aplica de la misma forma tanto para APIs MID como para APIs CRUD.
