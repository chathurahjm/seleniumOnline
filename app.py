from flask import Flask, request, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import traceback
import json

app = Flask(__name__)
CORS(app)

@app.route('/api/execute', methods=['POST'])
def execute_selenium():
    try:
        code = request.json.get('code')
        
        # Set up Chrome options for headless execution
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        
        # Create a new Chrome driver instance
        driver = webdriver.Chrome(options=chrome_options)
        
        try:
            # Execute the user's code in a safe environment
            exec_globals = {
                'webdriver': webdriver,
                'By': By,
                'driver': driver
            }
            
            # Execute the code
            exec(code, exec_globals)
            
            return jsonify({
                'status': 'success',
                'message': 'Code executed successfully'
            })
            
        except Exception as e:
            return jsonify({
                'status': 'error',
                'message': str(e),
                'traceback': traceback.format_exc()
            })
            
        finally:
            driver.quit()
            
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        })

if __name__ == '__main__':
    app.run(debug=True)
