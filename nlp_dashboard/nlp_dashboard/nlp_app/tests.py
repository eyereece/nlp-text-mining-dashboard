from django.test import TestCase, Client
from django.urls import reverse
from django.http import JsonResponse
from unittest.mock import patch, MagicMock

import pandas as pd

from nlp_app.views import (
    get_articles_data,
    get_releases_claps_by_week,
)

# TESTS
class GetReleasesClapsByWeekTests(TestCase):
    @patch('nlp_app.views.get_articles_data')  # Mock the data retrieval function
    def test_get_releases_claps_by_week(self, mock_get_articles_data):
        # Sample data to return from the mock function
        mock_data = pd.DataFrame({
            'published_date': ['2023-10-01', '2023-10-02', '2023-10-08'],
            'title': ['Article 1', 'Article 2', 'Article 3'],
            'claps': [10, 5, 15]
        })
        mock_get_articles_data.return_value = mock_data

        # Simulate a GET request
        response = self.client.get(reverse('releases-claps-by-week')) 
        
        # Decode the response content
        json_data = response.content.decode("utf-8")
        print("JSON RESPONSE: ", json_data)
        # chart_data = json.loads(json_data)
        # print ("CHART DATA", chart_data)

        # Check that the response status code is 200 (OK)
        self.assertEqual(response.status_code, 200)

        # Check the structure of the response data
        expected_response = [
            {'published_date': '2023-10-01T00:00:00', 'releases': 1, 'claps': 10},
            {'published_date': '2023-10-08T00:00:00', 'releases': 2, 'claps': 20}
        ]
        self.assertJSONEqual(json_data, expected_response)

    def test_method_not_allowed(self):
        # Simulate a POST request (or any method other than GET)
        response = self.client.post(reverse('releases-claps-by-week')) 

        # Check that the response status code is 405 (Method Not Allowed)
        self.assertEqual(response.status_code, 405)
        self.assertJSONEqual(response.content, {"error": "Method not allowed"})

