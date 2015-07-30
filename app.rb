require 'rubygems'
require 'sinatra'
require 'json'
require 'rest_client'
require "sinatra/reloader" if development?

get '/' do
  erb :index
end

get '/favorites/' do
  # Purpose: This route renders your favorited movies.

  # 1) Removed Line below so that server would render html instead of json
  # response.header['Content-Type'] = 'application/json'

  # 2) Reads json data from file and
  file = open("data.json")
  movies_json = JSON.parse(file.read)
  # 3) Stores the movie titles into an array
  movie_titles =[]
  movies_json.each do |movie|
    movie.each do |record|
      # 4) Each record is in the form of [key, value]. Here, we're taking only the title of the movie that is paired with the "name" key
      movie_titles << record[1] if record[0] == 'name'
    end
  end
  # 5) Here we set up our instance variable "favorite movies" to use in the "favorite" erb view template
  @favorite_movies =[]
  # 6) Here we take each title that we collected earlier from our file and request the movie information form the omdbapi api.
  #    I used the rest-client gem to make the call so that I can submit the title as a parameter, along with the other parameters
  #    as described in the api documentation.
  movie_titles.each do |title|
    api_result = RestClient.get "https://www.omdbapi.com", { :params => {:t => title, :y => nil, :plot => 'short'}, accept: :json}
    movie_object = JSON.parse(api_result)
    # 7) Every API response we get is stored in the instance variable for later rendering.
    @favorite_movies << movie_object
  end
  # 8) Here we render the favorites erb template which we had to create. The template renders a "template" html for each movie
  # in the @favorite_movies variable
  erb :favorites
end

post '/favorites/' do
  # Purpose: This method adds a favorite movie to your list.

  #1) We set the content_type to json
  content_type :json
  #2) We open the file and set it to an empty array if the file is empty
  file = JSON.parse(File.read('data.json')) rescue []
  return 'Invalid Request' unless params[:name] && params[:oid]
  # 3) This code is logic I built to check if the movie selected is already a favorite movie. First we initialize
  # already_a_favorite to false. And then we check the name in the parameters against the movie titles that are already
  # in the file. If a match is found, the already_a_favorite is then set to true.
  already_a_favorite = false
  file.each do |movie|
    already_a_favorite = true if movie["name"] == params[:name]
  end
  # 4) Here we store the movie object only if it's not already a favorite movie
  file << { :name => params[:name], :oid => params[:oid] } unless already_a_favorite

  # 5) Here we write the json back to our persistence layer and redirect to the favorites with method of "get"
  File.write('data.json',JSON.pretty_generate(file))
  redirect '/favorites/'
end

post '/remove_favorite/' do
  # Purpose: I added this method outside of the assignment, to allow users to remove favorited movies.
  # 1) The beginning is similar to POST '/favorites/'. We use POST verb because the user uses this route to submit a change to the DB,
  #    in this case, removing a movie from our database/persistence layer
  content_type :json
  file = JSON.parse(File.read('data.json')) rescue []
  return 'Invalid Request' unless params[:name] && params[:oid]

  # 2) This code goes through movie item on the file and deletes the one that matches the 'name' parameter
  file.delete_if { |movie| movie["name"] == params[:name]}

  # 3) Now that the file was changed, we save our changes to the persistence layer, converting our file to a json object
  #    and then we redirect to see an updated favorites list.
  File.write('data.json',JSON.pretty_generate(file))
  redirect '/favorites/'
end
