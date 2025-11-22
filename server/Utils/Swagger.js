import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Management API",
      version: "1.0.0",
      description: "API مستندات برای مدیریت کاربران",
    },
    servers: [{ url: "http://localhost:5000/api" }],
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter JWT token to access protected routes",
      },
    },
  },
  security: [
      {
        bearerAuth: [],
      },
    ],
  apis: ["./routes/*.js", "./Controllers/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };
