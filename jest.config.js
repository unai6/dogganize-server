module.exports = 
    {
        preset: "@shelf/jest-mongodb",
        testEnvironment : "node",
        "reporters": [
          "default",
          ["./node_modules/jest-html-reporter", 
          
          {
              pageTitle: "Test Report",
              outputPath : "Test-report.html",
              includeFailureMsg : true
          }]
      ]
      }
