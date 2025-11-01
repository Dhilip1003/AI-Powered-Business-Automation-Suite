# AI-Powered Business Automation Suite

An intelligent automation platform leveraging Java Spring Boot and AI APIs to automate complex business workflows, reducing manual effort by 80%.

## Features

- 🤖 **AI-Powered Processing**: Integrates with OpenAI API for intelligent decision-making and data analysis
- 🔄 **Workflow Engine**: Create, manage, and execute complex business workflows
- 📊 **Dashboard**: Real-time monitoring of workflow executions and statistics
- 🎯 **Multi-Step Workflows**: Support for AI processing, data transformation, notifications, and conditional logic
- 📈 **Execution History**: Track and analyze workflow execution performance
- 🎨 **Modern UI**: React-based frontend with Material-UI components

## Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **H2 Database** (in-memory)
- **WebFlux** (for AI API calls)
- **Lombok**

### Frontend
- **React 18**
- **Material-UI (MUI)**
- **React Router**
- **Axios**
- **Recharts**
- **Vite**

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Node.js 18+ and npm
- OpenAI API key (optional, for AI features)

## Getting Started

### Backend Setup

1. **Configure OpenAI API Key** (optional):
   - Set the `OPENAI_API_KEY` environment variable, or
   - Update `src/main/resources/application.yml` with your API key

2. **Build and run the Spring Boot application**:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   The backend will be available at `http://localhost:8080/api`

3. **Access H2 Console** (optional):
   - Navigate to `http://localhost:8080/api/h2-console`
   - JDBC URL: `jdbc:h2:mem:automationdb`
   - Username: `sa`
   - Password: (leave empty)

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## Project Structure

```
.
├── src/
│   └── main/
│       ├── java/com/aisuite/
│       │   ├── config/          # Configuration classes
│       │   ├── controller/      # REST controllers
│       │   ├── model/           # Entity models
│       │   ├── repository/      # Data repositories
│       │   └── service/         # Business logic
│       └── resources/
│           └── application.yml  # Application configuration
├── frontend/
│   └── src/
│       ├── components/          # React components
│       ├── services/           # API service layer
│       └── App.jsx             # Main app component
├── pom.xml                     # Maven dependencies
└── README.md                   # This file
```

## API Endpoints

### Workflows
- `GET /api/workflows` - Get all workflows
- `GET /api/workflows/{id}` - Get workflow by ID
- `POST /api/workflows` - Create new workflow
- `PUT /api/workflows/{id}` - Update workflow
- `DELETE /api/workflows/{id}` - Delete workflow
- `POST /api/workflows/{id}/execute` - Execute workflow
- `GET /api/workflows/{id}/executions` - Get execution history

### AI Services
- `POST /api/ai/process` - Process text with AI
- `POST /api/ai/analyze` - Analyze data with AI
- `POST /api/ai/decision` - Generate decision with AI

## Workflow Step Types

1. **AI_PROCESSING**: Uses AI to process data based on a prompt
2. **DATA_TRANSFORMATION**: Transforms data according to configuration
3. **NOTIFICATION**: Sends notifications
4. **CONDITIONAL**: Executes based on conditional logic
5. **MANUAL_REVIEW**: Pauses for manual intervention

## Usage Example

1. **Create a Workflow**:
   - Navigate to "Workflows" → "Create Workflow"
   - Add workflow name and description
   - Add steps with AI prompts or transformations
   - Set status to "Active"

2. **Execute a Workflow**:
   - Click the play icon on a workflow
   - Provide input data in JSON format
   - Monitor execution in real-time

3. **AI Playground**:
   - Test AI capabilities with the playground
   - Try different prompts and analysis types
   - Experiment with decision generation

## Configuration

Edit `src/main/resources/application.yml` to customize:
- AI model settings (model, temperature, max tokens)
- Automation settings (timeouts, retries)
- Database configuration

## Development

### Running Tests
```bash
mvn test
```

### Building for Production
```bash
# Backend
mvn clean package

# Frontend
cd frontend
npm run build
```

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue in the repository.

