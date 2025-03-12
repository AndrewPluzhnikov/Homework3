import pandas as pd

mediaAverages = pd.read_csv('/Users/andrew/Downloads/HW3 Website/socialMedia.csv')
print(mediaAverages.head())

mediaAveragesPlatforms = mediaAverages.groupby(['Platform', 'PostType']).agg(avg_likes = ("Likes", "mean"))
print(mediaAveragesPlatforms.head())

mediaAveragesPlatforms.to_csv('/Users/andrew/Downloads/HW3 Website/socialMediaAverages.csv')

mediaAveragesDates = mediaAverages.groupby(['Date']).agg(avg_likes = ("Likes", "mean"))
print(mediaAveragesDates.head())
mediaAveragesDates.to_csv('/Users/andrew/Downloads/HW3 Website/socialMediaTime.csv')
