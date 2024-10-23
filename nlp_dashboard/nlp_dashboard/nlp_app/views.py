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


def get_releases_claps_by_week(request, publisher=None):
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


# VIEWS
def home(request):
    releases_claps_by_week_url = '/api/releases-claps-by-week/'
    return render(request, 'home.html', {
        'releases_claps_by_week_url': releases_claps_by_week_url,
    })

def text_mining(request):
    return render(request, 'text-mining.html') 