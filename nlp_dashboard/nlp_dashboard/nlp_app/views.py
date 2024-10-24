from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from .models import Articles

import pandas as pd

# cache articles data
cached_articles_data = {}

def get_articles_data(publisher=None):
    global cached_articles_data

    # Check if the data for the specific publisher is already cached
    cache_key = publisher or "all"
    
    # If the data is not cached, query the database
    if cache_key not in cached_articles_data:
        if publisher:
            queryset = Articles.objects.filter(collection=publisher).values(
                "author", "title", "collection", "read_time", "claps", "responses",
                "published_date", "pub_year", "pub_month", "pub_date", "pub_day",
                "word_count", "title_cleaned", "week", "log_claps", "word_count_title"
            )
        else:
            queryset = Articles.objects.all().values(
                "author", "title", "collection", "read_time", "claps", "responses",
                "published_date", "pub_year", "pub_month", "pub_date", "pub_day",
                "word_count", "title_cleaned", "week", "log_claps", "word_count_title"
            )
        
        # Store the queried data in the cache for the specific publisher
        cached_articles_data[cache_key] = pd.DataFrame(list(queryset))
    
    # Return the cached data for the given publisher
    return cached_articles_data[cache_key]

# releases vs claps result grouped by week
def get_releases_claps_by_week(request, publisher=None):
    """
    Processes article data to calculate weekly releases and claps for a specified publisher.
    Expected result: A JSON array, e.g.,
    [
        {"published_date": "2024-01-07", "releases": 5, "claps": 100},
        {"published_date": "2024-01-14", "releases": 3, "claps": 50}
    ]
    """
    if request.method == 'GET':
        df = get_articles_data(publisher)

        # Convert 'published_date' to datetime
        df["published_date"] = pd.to_datetime(df["published_date"], errors="coerce")

        # Group by weeks for releases
        releases_by_week = (
            df.groupby(pd.Grouper(key="published_date", freq="W"))["title"]
            .count()
            .reset_index(name="releases")
        )
        # Group by weeks for claps (sum of claps per week)
        claps_by_week = (
            df.groupby(pd.Grouper(key="published_date", freq="W"))["claps"]
            .sum()
            .reset_index(name="claps")
        )

        # Merge the two DataFrames on the published_date
        merged_data = pd.merge(releases_by_week, claps_by_week, on="published_date")

        # Convert to JSON format
        chart_data = merged_data.to_dict(orient="records")

        return JsonResponse(chart_data, safe=False)
    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)

# Releases vs claps by day of week
def get_releases_claps_by_day(request, publisher=None):
    """
    Calculates the average number of articles published and average claps per day for a given publisher.
    Expected result: A JSON array, e.g.,
    [
        {"pub_day": "Monday", "avg_articles_published": 1.5, "avg_claps_per_day": 75.0},
        {"pub_day": "Tuesday", "avg_articles_published": 2.0, "avg_claps_per_day": 60.0}
    ]
    """
    if request.method == 'GET':
        df = get_articles_data(publisher)

        # Count unique weeks
        unique_weeks = df['week'].nunique()

        # Group by 'pub_day' and calculate both average articles and claps per day
        grouped = df.groupby('pub_day').agg(
            avg_articles_published=('title', 'size'), avg_claps_per_day=('claps', 'mean')
        )

        # Divide articles count by unique weeks to get the average
        grouped['avg_articles_published'] = grouped['avg_articles_published'] / unique_weeks

        # Convert the result to JSON and return response
        result = grouped.reset_index().to_dict(orient='records')
        return JsonResponse(result, safe=False)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


# Claps distribution of each publisher
def get_outliers(series):
    """
    Helper function to find the outliers
    """
    # Calculate the first quartile (Q1) of the data
    q1 = series.quantile(0.25)
    
    # Calculate the third quartile (Q3) of the data
    q3 = series.quantile(0.75)
    
    # Compute the Interquartile Range (IQR)
    iqr = q3 - q1
    
    # Determine the lower bound for outliers
    lower_bound = q1 - 1.5 * iqr
    
    # Determine the upper bound for outliers
    upper_bound = q3 + 1.5 * iqr
    
    # Return the values in the series that are outside the lower and upper bounds
    return series[(series < lower_bound) | (series > upper_bound)]

def get_claps_distribution(request, publisher=None):
    """
    Processes article data to calculate the distribution of log claps for each collection.
    Expected result: A JSON array, e.g.,
    [
        {
            "label": "Collection A",
            "min": 1,
            "q1": 5,
            "median": 10,
            "q3": 15,
            "max": 20,
            "outliers": [25, 30]
        },
        {
            "label": "Collection B",
            "min": 2,
            "q1": 4,
            "median": 8,
            "q3": 12,
            "max": 16,
            "outliers": []
        }
    ]
    """
    if request.method == 'GET':
        df = get_articles_data(publisher)
        df = df[['collection', 'log_claps']]
        grouped = df.groupby('collection')
        result = []
        if df.empty:
            return  JsonResponse(result, safe=False)
        for collection, group in grouped:
            stats = group['log_claps'].describe(percentiles=[0.25, 0.5, 0.75])
            outliers = get_outliers(group['log_claps'])
            result.append(
            {
                "label": collection,
                "min": stats["min"],
                "q1": stats["25%"],
                "median": stats["50%"],
                "q3": stats["75%"],
                "max": stats["max"],
                "outliers": outliers.tolist(),
            }
        )
        return JsonResponse(result, safe=False)
    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)


# Percentages of articles by publisher (count number of articles per each publisher)

# Number of unique authors per publisher

# VIEWS
def home(request):
    releases_claps_by_week_url = '/api/releases-claps-by-week/'
    releases_claps_by_day_url = '/api/releases-claps-by-day/'
    claps_distribution_url = '/api/claps-distribution/'
    return render(request, 'home.html', {
        'releases_claps_by_week_url': releases_claps_by_week_url,
        'releases_claps_by_day_url': releases_claps_by_day_url,
        'claps_distribution_url': claps_distribution_url,
    })

def text_mining(request):
    return render(request, 'text-mining.html') 