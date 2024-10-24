from django.test import TestCase, Client
from django.urls import reverse
from django.http import JsonResponse
from unittest.mock import patch, MagicMock

import json
import pandas as pd

from nlp_app.views import (
    get_articles_data,
    get_releases_claps_by_week,
    get_releases_claps_by_day,
    get_claps_distribution,
    get_publisher_count,
    get_nunique_authors, 
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
class ClapsDistributionTest(TestCase):
    @patch('nlp_app.views.get_articles_data')
    def test_get_claps_distribution(self, mock_get_articles_data):
        # Mock data representing the actual structure with 'collection' and 'log_claps'
        mock_data = pd.DataFrame([
            {"collection": 'Towards Data Science', 'log_claps': 10},
            {"collection": "Towards Data Science", "log_claps": 20},
            {"collection": "TowardsAI", "log_claps": 30},
            {"collection": "TowardsAI", "log_claps": 40},
            {"collection": "Javarevisited", "log_claps": 50},
            {"collection": "Data Engineer Things", "log_claps": 60},
        ])
        # Mock the return value
        mock_get_articles_data.return_value = mock_data

        # Simulate a GET request
        response = self.client.get(reverse('claps-distribution'))

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "application/json")

        # Load the response content
        data = json.loads(response.content.decode("utf-8"))

        # Check the structure of the returned data
        self.assertIsInstance(data, list)  # Expecting a list of results
        self.assertEqual(len(data), 4)  # 4 unique collections


# articles count per publisher
class PublisherCountTest(TestCase):
    @patch('nlp_app.views.get_articles_data')
    def test_get_publisher_count(self, mock_get_articles_data):
        mock_data = pd.DataFrame([
            {"collection": "Towards Data Science"},
            {"collection": "Towards Data Science"},
            {"collection": "Towards AI"},
            {"collection": "Level Up Coding"},
        ])
        mock_get_articles_data.return_value = mock_data

        # Simulate a GET request
        response = self.client.get(reverse('publisher-count'))

        # Decode the response content
        json_data = response.content.decode('utf-8')

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "application/json")

        # Load the response content
        data = json.loads(response.content.decode("utf-8"))

        # Check the structure of the returned data
        self.assertIsInstance(data, dict)  # Expecting a dictionary as result
        self.assertEqual(len(data), 3)  # 3 unique collections

        # Validate the counts for each collection
        expected_counts = {
            "Towards Data Science": 2,
            "Towards AI": 1,
            "Level Up Coding": 1,
        }

        for collection, count in expected_counts.items():
            self.assertIn(collection, data)  # Ensure each collection is returned
            self.assertEqual(data[collection], count)  # Check the count matches


# unique authors count per publisher
class NuniqueAuthorsTest(TestCase):
    @patch('nlp_app.views.get_articles_data')
    def test_get_nunique_authors(self, mock_get_articles_data):
        mock_data = pd.DataFrame([
            {"collection": "Towards Data Science", "author": "Author 1"},
            {"collection": "Towards Data Science", "author": "Author 2"},
            {"collection": "Towards AI", "author": "Author 1"},
            {"collection": "Level Up Coding", "author": "Author 3"},
            {"collection": "Level Up Coding", "author": "Author 1"},
        ])
        mock_get_articles_data.return_value = mock_data

        # Simulate a GET request
        response = self.client.get(reverse('publisher-count'))

        # Decode the response content
        json_data = response.content.decode('utf-8')

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "application/json")

        # Load the response content
        data = json.loads(response.content.decode("utf-8"))

        # Check the structure of the returned data
        self.assertIsInstance(data, dict)  # Expecting a dictionary as result
        self.assertEqual(len(data), 3)  # 3 unique collections

        # Validate the counts for each collection
        expected_counts = {
            "Towards Data Science": 2,  # 2 unique authors
            "Towards AI": 1,  # 1 unique author
            "Level Up Coding": 2,  # 2 unique authors
        }

        for collection, count in expected_counts.items():
            self.assertIn(collection, data)  # Ensure each collection is returned
            self.assertEqual(data[collection], count)  # Check the count matches

# API 2 - TEXT MINING

