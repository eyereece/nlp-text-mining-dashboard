from django.test import TestCase, Client
from django.urls import reverse
from django.http import JsonResponse
from unittest.mock import patch, MagicMock

import pandas as pd

from nlp_app.views import (
    get_articles_data,
    get_releases_claps_by_week,
    get_releases_claps_by_day,
)

# TESTS
# releases vs claps by week
class GetReleasesClapsByWeekTests(TestCase):
    @patch('nlp_app.views.get_articles_data') 
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


# releases vs claps by day of week
class GetReleasesClapsByDayTests(TestCase):
    @patch('nlp_app.views.get_articles_data')
    def test_get_releases_claps_by_day(self, mock_get_articles_data):
        # Sample data to return from the mock function
        mock_data = pd.DataFrame([{
            'pub_day': 'Wednesday',
            'title': 'Normalization vs Denormalization',
            'claps': 623,
            'collection': 'Data Engineer Things',
            'week': 1,
        },
        {
            'pub_day': 'Wednesday',
            'title': 'Conquering real-time data',
            'claps': 157,
            'collection': 'Data Engineer Things',
            'week': 1,
        },
        {
            'pub_day': 'Tuesday',
            'title': 'Cassandra Data Generation',
            'claps': 17,
            'collection': 'Data Engineer Things',
            'week': 2,
        }
        ])
        mock_get_articles_data.return_value = mock_data

        # Simulate a GET request
        response = self.client.get(reverse('releases-claps-by-day'))

        # Decode the response content
        json_data = response.content.decode('utf-8')

        # Check that the response status code is 200 (OK)
        self.assertEqual(response.status_code, 200)

        # Check the structure of the response data
        expected_response = [
            {"pub_day": "Tuesday", "avg_articles_published": 0.5, "avg_claps_per_day": 17.0},
            {"pub_day": "Wednesday", "avg_articles_published": 1.0, "avg_claps_per_day": 390.0},
        ]
        self.assertJSONEqual(json_data, expected_response)

# claps distribution

# articles count per publisher

# unique authors count per publisher

# API 2 - TEXT MINING

