task :default => [:xpi]

task :xpi do
  rm_f 'searchy.xpi'
  puts `find chrome chrome.manifest modules install.rdf | egrep -v '(#|~|DS_Store)' | xargs zip seinfeld.xpi`
end
