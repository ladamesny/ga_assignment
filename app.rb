require 'rubygems'
require 'sinatra'
require 'json'
require 'rest_client'
require "sinatra/reloader" if development?

get '/' do
  erb :index
end

get '/favorites/' do
  # response.header['Content-Type'] = 'application/json'
  file = open("data.json")
  @objects = JSON.parse(file.read)
  @data_hash =[]

  @objects.each do |movie|
    movie.each do |record|
      @data_hash << record[1] if record[0] == 'name'
    end
  end
  @favorite_movies =[]
  @data_hash.to_json
  @data_hash.each do |movie_name|
    api_result = RestClient.get "https://www.omdbapi.com", { :params => {:t => movie_name, :y => nil, :plot => 'short'}, accept: :json}
    movie_object = JSON.parse(api_result)
    @favorite_movies << movie_object
  end
  erb :favorites
end

post '/favorites/' do
  content_type :json
  file = JSON.parse(File.read('data.json')) rescue []
  puts file.inspect
  return 'Invalid Request' unless params[:name] && params[:oid]
  already_a_favorite = false
  file.each do |movie|
    if movie["name"] == params[:name]
      already_a_favorite = true
    end
  end
  # movie = { :name => params[:name], :oid => params[:oid] }
  if !already_a_favorite
    file << { :name => params[:name], :oid => params[:oid] }
  end
  File.write('data.json',JSON.pretty_generate(file))
  redirect '/favorites/'
end
