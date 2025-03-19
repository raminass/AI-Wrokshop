# AI Microservices: A Practical Guide

This repository contains materials for building practical AI systems using a microservices architecture. The project demonstrates how to build a text analysis platform with multiple services:

1. **Sentiment Analysis Service** (using HuggingFace)
2. **Text Generation Service** (using OpenAI API)
3. **API Gateway** (to coordinate requests)

## Contents

- `tutorial.ipynb`: Jupyter notebook with detailed tutorial and explanations
- `ai-microservices-demo/`: Implementation of the complete microservices system
- `sentiment-analysis/`: Standalone implementation of the sentiment analysis service

## Getting Started

### Prerequisites

- Python 3.9+
- Docker and Docker Compose
- OpenAI API key (for text generation service)

### Installation

1. Clone this repository
2. Navigate to the project directory
3. Follow the instructions in `tutorial.ipynb` for detailed setup

## Architecture

The system demonstrates a microservices architecture with:
- Independent services for different AI capabilities
- Docker containerization for each service
- API Gateway pattern for unified access
- Monitoring and observability tools integration

## License

This project is licensed under the MIT License - see the LICENSE file for details. 