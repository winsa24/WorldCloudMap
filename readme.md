# Project description  
I'd like to explore the language distribution among the world. So I find this dataset : https://www.kaggle.com/rtatman/world-atlas-of-language-structures.
In this dataset, there are six important columns : Name, latitude, longitude, genus, family, macroarea. Name is string that represent the language name. Latitude and longitude contains positive and negative double decimals. Genus has 544 different values. 256 different values in family. And 7 different values in macroarea.
And there are 2679 rows of data in total.

Based on this dataset, I'd like to show the distribution of different languages on a geometry map. 

On top of that, I also find another related dataset : https://www.kaggle.com/kkhandekar/popular-words-in-different-languages. This dataset contains 33 most popular words in 108 languages. Each column refers to one language. And each row refers to one popular word. 

Based on this dataset, I'd like to generate each language a word cloud. And apply it as texture on each region on the atlas.

But as far as I concerned for now, if we use this word-cloud-texture, it can neither cover all the languages mentioned listed in the first dataset, nor integrate with other texture-like attributs to convey more information in a single static chart.

potential added dataset:
https://www.kaggle.com/rtatman/world-language-family-map?select=languages-and-dialects-geo.csv

# Run the project  
Start a python simple server and go to the assigned port, then you can interact with page with your cursor.  