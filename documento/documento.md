# 1. Introducción
El presente documento técnico detalla la arquitectura, el diseño y la implementación del Sistema de Gestión de Actividades. Este proyecto nace de la necesidad de modernizar y optimizar el registro, inscripción y control de asistencia a eventos y talleres institucionales. El enfoque principal del desarrollo se centra en la aplicación de prácticas modernas de Ingeniería de Software y cultura DevOps, garantizando un despliegue ágil, seguro y escalable mediante la contenedorización y el alojamiento en la nube.

# 2. Descripción del Proyecto
El sistema es una plataforma web integral basada en una arquitectura cliente-servidor, diseñada con un enfoque responsivo y minimalista.

## Características Principales:
* Sistema de autenticación con roles diferenciados (Administrador y Estudiante).
* Gestión de Actividades (CRUD): Creación, lectura, actualización y eliminación de eventos.
* Inteligencia Artificial Integrada: Generación automática de descripciones de actividades utilizando la API de Google Gemini.
* Control de Asistencia: Módulo interactivo en tiempo real para que los administradores pasen lista a los estudiantes inscritos.
## Stack Tecnológico:
* Frontend: Vue.js 3 (Composition API), Vite, Tailwind CSS, Pinia (Manejo del estado), Vue Router.
* Backend: NestJS (Node.js framework), TypeORM.
* Base de Datos: MySQL 8.0.

# 3. Arquitectura DevOps
La arquitectura del proyecto sigue el modelo de una APIREST dentro de contenedor docker.
Se utiliza nginx para servir tanto el frontend y el backend 
Capa de Lógica de Negocio: Una API RESTful desarrollada en NestJS que procesa las solicitudes, valida las reglas de negocio y se comunica con servicios externos (IA).
Capa de Datos: Un motor de base de datos relacional (MySQL) que persiste la información de usuarios, actividades y participaciones, respaldado por volúmenes de almacenamiento persistente.

# 4. Docker y Docker Compose
Para estandarizar los entornos de desarrollo y producción, se implementó una estrategia de contenedorización completa.
El archivo docker-compose.yml orquesta tres servicios interconectados a través de una red privada virtual (bridge):
Servicio db: Basado en la imagen oficial de mysql:8.0. Expone el puerto 3306 e implementa un volumen (db_data) para evitar la pérdida de información en caso de reinicio del contenedor.
Servicio backend: Construido a partir de un Dockerfile personalizado basado en Node.js. Expone el puerto 3000 y consume variables de entorno inyectadas para la conexión segura a la base de datos y APIs externas. Depende estrictamente de la disponibilidad del servicio db.
Servicio frontend: Construido con un entorno de Node para la fase de compilación y Nginx para la fase de ejecución, exponiendo el puerto estándar 80.

# 5. Pipeline CI/CD
Se diseñó un flujo de Integración y Despliegue Continuo (CI/CD) para automatizar el ciclo de vida del software.
Integración Continua (CI): Cada push o pull request hacia la rama principal del repositorio dispara un flujo de trabajo (ej. GitHub Actions) que instala dependencias, ejecuta linters y verifica la compilación exitosa tanto del frontend como del backend, garantizando que el código defectuoso no llegue a producción.
Despliegue Continuo (CD): A través de empaquetado de imágenes (formato .tar) o pulls automatizados desde el servidor, se asegura una actualización rápida del entorno de producción sin requerir compilaciones pesadas directamente en la máquina host.

# 6. AWS (Amazon Web Services)
El entorno de producción está alojado en la infraestructura de AWS, utilizando los siguientes componentes:

* Amazon EC2 (Elastic Compute Cloud): Se aprovisionó una instancia virtual ejecutando una distribución de Linux (Amazon Linux / RHEL).
* Security Groups (Firewall de AWS): Se configuraron reglas de entrada (Inbound Rules) estrictas para permitir únicamente el tráfico necesario:
* Puerto 22 (TCP): Acceso SSH para administración.
* Puerto 80 (HTTP): Tráfico web público hacia el frontend.
* Puerto 3000 (TCP): Tráfico desde el cliente hacia la API RESTful.
* Elastic IP: Se asignó una dirección IP pública estática para garantizar que el endpoint de la API y el acceso web no cambien tras un reinicio de la instancia.

# 7. Seguridad
La plataforma incorpora múltiples capas de seguridad tanto a nivel de infraestructura como de aplicación:

* Autenticación JWT (JSON Web Tokens): Las sesiones se manejan sin estado en el backend. Cada solicitud del cliente incluye un token cifrado interceptado y validado en cada ruta protegida.
* Protección de Rutas en Frontend: Implementación de Navigation Guards en Vue Router para evitar accesos no autorizados a las vistas administrativas (/admin).
* Manejo de Secretos: Las credenciales críticas (contraseñas de DB, claves de API) nunca se exponen en el código fuente. Se inyectan exclusivamente a través de archivos .env ignorados en el control de versiones.
* Seguridad de Base de Datos: Configuración del contenedor de MySQL aislándolo en la red de Docker, accesible solo por el backend.

# 8. Propuesta de escalabilidad utilizando Kubernetes
Aunque Docker Compose cumple excelentemente para un despliegue monolítico en un único nodo, el crecimiento futuro de la institución requerirá alta disponibilidad. Se propone la siguiente migración hacia un clúster de Kubernetes (K8s):

Desacoplamiento de Base de Datos: Migrar el servicio de MySQL desde un contenedor local hacia un servicio gestionado en la nube como Amazon RDS para delegar los respaldos y la alta disponibilidad.
Deployments y Replicaset: Reemplazar los servicios de backend y frontend de Compose por Deployments en K8s. Esto permitiría tener múltiples réplicas (Pods) del backend en distintos nodos para balancear la carga.
Horizontal Pod Autoscaler (HPA): Configurar reglas basadas en el consumo de CPU o memoria para que Kubernetes escale automáticamente el número de contenedores del backend durante los períodos de matrícula o inscripción masiva a actividades.
Ingress Controller: Implementar un Ingress (ej. Nginx Ingress Controller) para gestionar el enrutamiento HTTP/HTTPS, reemplazar la exposición directa de puertos y habilitar certificados SSL de manera automatizada.

# 9. Conclusiones
El desarrollo e implementación del Sistema de Gestión de Actividades demuestra el valor tangible de adoptar una arquitectura basada en microservicios lógicos y cultura DevOps. El uso de contenedores garantizó un entorno predictible y confiable, mientras que el despliegue en AWS proporcionó la infraestructura necesaria para su acceso público de manera segura.

Se logró construir una plataforma robusta y moderna, con una experiencia de usuario fluida, que cumple con todos los requisitos funcionales iniciales (roles, inscripciones, asistencia) e innova integrando capacidades de Inteligencia Artificial para la gestión del contenido administrativo. La plataforma actual sirve como una base sólida y estructurada, totalmente preparada para escalar según las necesidades futuras de la institución.