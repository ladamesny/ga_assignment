require 'rubygems'
require 'sinatra'
require 'json'
require "sinatra/reloader" if development?

get '/' do
  erb :index
end

get '/favorites' do
  content_type :json
  response.header['Content-Type'] = 'application/json'
  File.read('data.json')
end

post '/favorites' do
  content_type :json
  file = JSON.parse(File.read('data.json')) rescue ""
  return 'Invalid Request' unless params[:name] && params[:oid]
  movie = { name: params[:name], oid: params[:oid] }
  puts "#{movie}"
  binding.pry
  file << movie
  File.write('data.json',JSON.pretty_generate(file))
  movie.to_json
  redirect_to '/'
end
