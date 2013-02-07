var cconsole = require('colorize').console;
var q = require('q');

var color = 'blue';
var base = 'yellow';
var file = 'black'
var logo = function() {
    return '' +
    '#' + base + '[                                                                 ]#' + color + '[]#' + base + '[%%%.+ I+.        \n' +
    '#' + base + '[                                                 ]#' + color + '[         :$ $I ]%.%+7 7 ^        \n' +
    '#' + base + '[                                                 ]#' + color + '[      ,=I,I.... ]?%%7            \n' +
    '#' + base + '[                                                 ]#' + color + '[      : $?I...  $ ,             ]\n' +
    '#' + base + '[                                                     ,7%%%7  ]#' + color + '[..7 7]               \n' +
    '#' + base + '[                                                 =I####,+,+ : ]#' + color + '[ I,7]               \n' +
    '#' + base + '[                                             II###:I   $ , I ]#' + color + '[  ?]                 \n' +
    '#' + base + '[                                         ,7###~I     Z     ]#' + color + '[   7 ,]                \n' +
    '#' + base + '[                                     ,7#%#7I           ]#' + color + '[   $ 7 7                  ]\n' +
    '#' + base + '[                                  7?##?I,             ]#' + color + '[   ,,, ,+  $               ]\n' +
    '#' + base + '[                              7?##,7,               ]#' + color + '[     ~ ,  ,  :               ]\n' +
    '#' + base + '[                          ,7,#%#7                 ]#' + color + '[     $, ,   7 , 7,             ]\n' +
    '#' + base + '[                        I#%%#7                  ]#' + color + '[    +,,     , +,    $,           ]\n' +
    '#' + base + '[                    +I#%%#7                    ]#' + color + '[   7 $       $      $   $,        ]\n' +
    '#' + base + '[                 =7#%%#$:                    ]#' + color + '[    ? $   $7=7$          :  $,      ]\n' +
    '#' + base + '[              =7#%#$+                      ]#' + color + '[    $=,    ,               =   ,      ]\n' +
    '#' + base + '[         , 7~##7I                       ]#' + color + '[     7                            ..?    ]\n' +
    '#' + base + '[       7,###+7                          ]#' + color + '[    I                            ...     ]\n' +
    '#' + base + '[   $~####7+                             ]#' + color + '[    =   I           X     +      ,7%.7   ]\n' +
    '#' + base + '[+7####=I                                ]#' + color + '[       ,,      \\                 ..%.7   ]\n' +
    '#' + base + '[7,7,?                                   ]#' + color + '[               ,                ..%.,=   ]\n' +
    '#' + base + '[  ,                                     ]#' + color + '[    I                         ...%..     ]\n' +
    '#' + base + '[                                         ]#' + color + '[    ~~=.           $      .....%.. 7    ]\n' +
    '#' + base + '[                                          ]#' + color + '[   :$ZZ..  ~        ...$..%..,Z?$I   ]\n' +
    '#' + base + '[                                          ]#' + color + '[     ,?$...     .....$..%.,O7+7$     ]\n' +
    '#' + base + '[                                            ]#' + color + '[      ,,7I:$$$ZZ$$$$ZOZ+I$           ]\n' +
    '#' + base + '[                                              ]#' + color + '[        ^^....,,+?^^              ]';
};

module.exports = {
    welcome: function() {
        var defer = new q.defer();
        defer.resolve();
        var msg = '\n\n\n\t\t\tWelcome to Baggit!\n\n' + 
            '     Baggit takes files, and hosts them using GitHub Pages\n';
        console.log(msg.bold);
        var txt = logo();
        cconsole.log(txt.replace('X', ' '));
        console.log('\n\n\n');
        return defer.promise;
    },
    file: function(names) {
        var name = names[0];
        if(names.length > 1) {
            name += ' and ' + (names.length - 1) + ' other' + (names.length === 2 ? '' : 's');
        }
        var defer = new q.defer();
        defer.resolve();
        var msg = '\n\n\n\t\t\tPushing file' + (names.length > 1 ? 's' : '') + ' to GitHub Pages\n' +
            '\n\t\t\tGenerating a url for each file\n';
        console.log(msg.bold);
        var txt = logo();
        var index = txt.indexOf('X');
        var before = txt.substr(0, index - Math.floor(name.length / 2));
        var after = txt.substr(index + Math.ceil(name.length / 2));
        cconsole.log(before + ']#' + file + '[' + name + ']]#' + color + '[' + after);
        console.log('\n\n\n');
        return defer.promise;
    }
};