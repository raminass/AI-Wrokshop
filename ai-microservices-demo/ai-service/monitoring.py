import time
from prometheus_client import Counter, Histogram, Gauge, start_http_server
import os

# Define metrics
REQUEST_COUNT = Counter(
    'ai_service_requests_total',
    'Total number of requests to the AI service',
    ['endpoint', 'status']
)

LATENCY = Histogram(
    'ai_service_request_duration_seconds',
    'Request latency in seconds',
    ['endpoint']
)

CONFIDENCE_SCORE = Gauge(
    'ai_service_confidence_score',
    'Confidence score of predictions',
    ['category']
)

MODEL_SIZE = Gauge(
    'ai_service_model_size_bytes',
    'Size of the loaded model in bytes'
)

MODEL_TYPE = Gauge(
    'ai_service_model_type',
    'Type of model being used (1=NLTK, 2=HuggingFace)',
    ['model_name']
)

class RequestLatencyMiddleware:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        # Start timing the request
        request_start = time.time()
        
        # Extract the path
        path = environ.get('PATH_INFO', '')
        
        # Create a wrapper for start_response that captures the status
        def _start_response(status, headers, exc_info=None):
            # Record request status
            status_code = int(status.split(' ')[0])
            REQUEST_COUNT.labels(endpoint=path, status=status_code).inc()
            
            # Return the original response
            return start_response(status, headers, exc_info)
        
        # Process the request
        response = self.app(environ, _start_response)
        
        # Record the latency
        LATENCY.labels(endpoint=path).observe(time.time() - request_start)
        
        return response

def record_prediction_confidence(category, confidence):
    """Record the confidence score for a prediction."""
    CONFIDENCE_SCORE.labels(category=category).set(confidence)

def set_model_info(model_name, model_type, size_bytes):
    """Set information about the currently loaded model."""
    # Set model type (1=NLTK, 2=HuggingFace)
    MODEL_TYPE.labels(model_name=model_name).set(model_type)
    MODEL_SIZE.set(size_bytes)

def init_metrics(port=8002):
    """Initialize the metrics server if enabled."""
    if os.environ.get('ENABLE_METRICS', 'false').lower() == 'true':
        metrics_port = int(os.environ.get('METRICS_PORT', port))
        start_http_server(metrics_port)
        print(f"Metrics server started on port {metrics_port}")
        return True
    return False 