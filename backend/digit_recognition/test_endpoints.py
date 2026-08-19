import urllib.request
import urllib.parse
import json

def test_endpoints():
    print("Starting API tests for database-free backend...")
    
    # 1. Test Prediction API
    # Generate 784 float values (all 0.1)
    dummy_image = [0.1] * 784
    
    predict_url = "http://localhost:8008/api/predict"
    data = json.dumps({"image": dummy_image}).encode("utf-8")
    
    req = urllib.request.Request(
        predict_url, 
        data=data, 
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    
    print("\nSending prediction request...")
    try:
        with urllib.request.urlopen(req) as res:
            response_data = json.loads(res.read().decode("utf-8"))
            print("Prediction Response:")
            print(json.dumps(response_data, indent=2))
            assert "prediction" in response_data
            assert "confidence" in response_data
            assert "probabilities" in response_data
            assert "timestamp" in response_data
    except Exception as e:
        print("Prediction request failed:", e)
        return

    print("\nAll API tests completed successfully!")

if __name__ == "__main__":
    test_endpoints()
