require 'rubygems'
require 'open-uri'
require 'rest-client'

x = 0;

for x in 0..20 do
  url='http://developer.echonest.com/api/v4/playlist/static?api_key=IH9Y5AOHGVIUSEXHS&format=json&type=genre-radio&song_selection=song_hotttnesss&genre=pop&results=10&bucket=id:rdio-US&bucket=tracks&limit=true'

  data = RestClient.get(url)

  fn = 'output' + x.to_s + '.js'

  File.open(fn, 'w') do |f|
    f.puts data
  end
end