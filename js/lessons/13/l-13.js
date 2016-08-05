/**
 * Вивчення JavaScript
 * Урок 13. Regular Expressions:
 * - Simple Patterns
 * - Special characters
 *
 * Щоб завантажити урок у Шелл:
 * Core.Load('../../lessons/13/l-13.js');

  What is RegExp?

  Regular expressions are patterns used to match character combinations in
  strings. In JavaScript, regular expressions are also objects. These patterns are
  used with the exec and test methods of RegExp, and with the match, replace,
  search, and split methods of String. This chapter describes JavaScript regular
  expressions.

*/

//
// Creating a regular expression
//

var re = /ab+c/;

re = new RegExp("ab+c");

//
// A patterns
// Simple patterns
//

/abc/

// Will match:
// "Hi, do you know your abc's?"
// "The latest airplane designs evolved from slabcraft."

//
// More complex patterns are made using special characters
//

/ab*c/

// matches any character combination in which a single 'a' is followed by zero
// or more 'b's (* means 0 or more occurrences of the preceding item) and then
// immediately followed by 'c'. In the string "cbbabbbbcdebc," the pattern
// matches the substring 'abbbbc'.
/*


Meaning of special characters in RegExp:

\ character

1. Makes non-special character a speacial one:
2. Makes special character a non-speacial one: /a\?/
3. /\\/ is also fine



^ character matches beginning of input.

Example: /^A/ is not for the 'A' in "an A", but for the 'A' in "An E".



$ character matches end of input.



* character matches the preceding expression 0 or more times. Equivalent to {0,}.



+	character matches the preceding expression 1 or more times. Equivalent to {1,}.



?	character matches the preceding expression 0 or 1 time. Equivalent to {0,1}.



.	character matches any single character except the newline character.



(x)	character matches 'x' and remembers the match. Notice the "capturing parentheses"

The '(foo)' and '(bar)' in the pattern /(foo) (bar) \1 \2/ match and remember
the first two words in the string "foo bar foo bar". The \1 and \2 in the
pattern match the string's last two words. Note that \1, \2, \n are used in the
matching part of the regex. In the replacement part of a regex the syntax $1,
$2, $n must be used, e.g.: 'bar foo'.replace( /(...) (...)/, '$2 $1' ).

// FIXME - why unexpected behaviourv here?

(?:x)	character  matches 'x' but does not remember the match. The parentheses
are called non-capturing parentheses, and let you define subexpressions for
regular expression operators to work with. Consider the sample expression
/(?:foo){1,2}/. If the expression was /foo{1,2}/, the {1,2} characters would
apply only to the last 'o' in 'foo'. With the non-capturing parentheses, the
{1,2} applies to the entire word 'foo'.



x(?=y) character matches 'x' only if 'x' is followed by 'y'. This is called a
lookahead.

For example, /Jack(?=Sprat)/ matches 'Jack' only if it is followed by 'Sprat'.
/Jack(?=Sprat|Frost)/ matches 'Jack' only if it is followed by 'Sprat' or
'Frost'. However, neither 'Sprat' nor 'Frost' is part of the match results.



x(?!y) character matches 'x' only if 'x' is not followed by 'y'. This is called
a negated lookahead.

For example, /\d+(?!\.)/ matches a number only if it is not followed by a
decimal point. The regular expression /\d+(?!\.)/.exec("3.141") matches '141'
but not '3.141'.



x|y	character matches either 'x' or 'y'.

For example, /green|red/ matches 'green' in "green apple" and 'red' in "red apple."



{n}	character matches exactly n occurrences of the preceding expression. N must
be a positive integer.

For example, /a{2}/ doesn't match the 'a' in "candy," but it does match all of
the a's in "caandy," and the first two a's in "caaandy."



{n,m}	Where n and m are positive integers and n <= m. matches at least n and at
most m occurrences of the preceding expression. When m is omitted, it's treated
as ∞.

For example, /a{1,3}/ matches nothing in "cndy", the 'a' in "candy," the first
two a's in "caandy," and the first three a's in "caaaaaaandy". Notice that when
matching "caaaaaaandy", the match is "aaa", even though the original string had
more a's in it.



[xyz]	Character set. This pattern type matches any one of the characters in the
brackets, including escape sequences. Special characters like the dot(.) and
asterisk (*) are not special inside a character set, so they don't need to be
escaped. You can specify a range of characters by using a hyphen, as the
following examples illustrate.

The pattern [a-d], which performs the same match as [abcd], matches the 'b' in
"brisket" and the 'c' in "city". The patterns /[a-z.]+/ and /[\w.]+/ match the
entire string "test.i.ng".

[^xyz] is a negated or complemented character set. That is, it matches anything
that is not enclosed in the brackets. You can specify a range of characters by
using a hyphen. Everything that works in the normal character set also works
here.

For example, [^abc] is the same as [^a-c]. They initially match 'r' in "brisket"
and 'h' in "chop."



[\b] matches a backspace (U+0008). You need to use square brackets if you want
to match a literal backspace character. (Not to be confused with \b.)



\b matches a word boundary. A word boundary matches the position where a word
character is not followed or preceeded by another word-character. Note that a
matched word boundary is not included in the match. In other words, the length
of a matched word boundary is zero. (Not to be confused with [\b].)

Examples: /\bm/ matches the 'm' in "moon" ; /oo\b/ does not match the 'oo' in
"moon", because 'oo' is followed by 'n' which is a word character; /oon\b/
matches the 'oon' in "moon", because 'oon' is the end of the string, thus not
followed by a word character; /\w\b\w/ will never match anything, because a word
character can never be followed by both a non-word and a word character.

Note: JavaScript's regular expression engine defines a specific set of
characters to be "word" characters. Any character not in that set is considered
a word break. This set of characters is fairly limited: it consists solely of
the Roman alphabet in both upper- and lower-case, decimal digits, and the
underscore character. Accented characters, such as "é" or "ü" are,
unfortunately, treated as word breaks.

\B matches a non-word boundary. This matches a position where the previous and
next character are of the same type: Either both must be words, or both must be
non-words. The beginning and end of a string are considered non-words.

For example, /\B../ matches 'oo' in "noonday", and /y\B./ matches 'ye' in
"possibly yesterday."



\cX	Where X is a character ranging from A to Z. matches a control character in a string.

For example, /\cM/ matches control-M (U+000D) in a string.



\d matches a digit character. Equivalent to [0-9].

For example, /\d/ or /[0-9]/ matches '2' in "B2 is the suite number."



\D matches any non-digit character. Equivalent to [^0-9].

For example, /\D/ or /[^0-9]/ matches 'B' in "B2 is the suite number."



\f	matches a form feed (U+000C).



\n	matches a line feed (U+000A).



\r	matches a carriage return (U+000D).



\s  matches a single white space character, including space, tab, form feed,
line feed. Equivalent to
[\f\n\r\t\v\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff].

\S	matches a single character other than white space. Equivalent to

[^\f\n\r\t\v\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff].


\t	matches a tab (U+0009).



\v	matches a vertical tab (U+000B).



\w	matches any alphanumeric character including the underscore. Equivalent to
[A-Za-z0-9_].

For example, /\w/ matches 'a' in "apple," '5' in "$5.28," and '3' in "3D."



\W matches any non-word character. Equivalent to [^A-Za-z0-9_].

For example, /\W/ or /[^A-Za-z0-9_]/ matches '%' in "50%."




\n Where n is a positive integer, a back reference to the last substring
matching the n parenthetical in the regular expression (counting left
parentheses).

For example, /apple(,)\sorange\1/ matches 'apple, orange,' in "apple, orange,
cherry, peach."



\0	matches a NULL (U+0000) character. Do not follow this with another digit,
because \0<digits> is an octal escape sequence.

\xhh	matches the character with the code hh (two hexadecimal digits)



\uhhhh	matches the character with the code hhhh (four hexadecimal digits).



\u{hhhh}	(only when u flag is set) matches the character with the Unicode value
hhhh (hexadecimal digits).




// Example: email validation from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript:
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

*/









// Lesson 13 end

//
// Homework:
//

// Task 1, points: 1

// TODO: read the https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions



// Task 2, points: 1

// The following RegExp is given, matching 'a' followed by 'b' followed by 'c':
var test = /abc/;
// logs out: abc
'abcdef'.match(test);
// TODO: change it to match 'a' followed by 'b' zero or more times, followed by 'c'



// Task 3, points: 1

// The following RegExp is given:
var test = /abc/;
// TODO: change it to match 'a' followed by 'b' one or more times, followed by 'c'



// Task 4, points: 1

// The following RegExp is given:
var test = /abc/;
// TODO: change it to match 'a' followed by 'b' zero or more times, followed by 'c'



// Task 5, points: 2

// The following RegExp is given:
var test = /abc/;
// TODO: change it to match 'a' followed by 'b' character from 5 to 6 times, followed by 'c'



// Task 6, points: 2

// The following RegExp is given:
var test = /abc/;
// TODO: change it to match any of 'a', 'b' or 'c' character, but not only one time.



// Task 7, points: 3

// The following RegExp is given:
var test = /abc/;
// TODO: change it to match any of 'a', 'b' or 'c' character, but only if it is followed by 'x' (lookahead).



// Task 8, points: 3

// The following RegExp is given:
var test = /abc/;
// TODO: change it to match any of 'a', 'b' or 'c' character, but only if it is NOT followed by 'x' (negated lookahead).



// Task 9, points: 2

// The following RegExp is given:
var test = /abc/;
// TODO: change it to match any character, EXCEPT 'a', 'b' or 'c'.


// Task 10, points: 2

// TODO: write a function which tells is some string having '@' in it, or not by retrning a boolean value.



// Task 11, points: 3

// TODO: finish a brokenEnglish function below to replace all 'th' in any string with 'z', case insensitive.
// if function works properly, it must do the following:

function brokenEnglish(normalText) {
  var brokenText = normalText;

  // TODO - Write your code here

  return brokenText;
}


// Must give: 'What is ze age of Her Majesty?'
console.log(brokenEnglish('What is the age of Her Majesty?'));

// Must give: 'ze life goes on, ze sun is shining'
console.log(brokenEnglish('The life goes on, the sun is shining.'));



// Task 12, points: 4

// TODO: finish a mooneEnglish function below to move 'h' letters in each word to the end of it (capturing parentheses), case insensitive.
// If function works properly, it must do the following tests:

// Must give: 'elloh'
mooneEnglish('hello');

// Must give: 'umidityh'
mooneEnglish('humidity');

// Must give: 'aloah'
mooneEnglish('aloha');

// Must give: 'eyh, wath are you doing ereh?'
mooneEnglish('hey, what are you doing here?');

function mooneEnglish(normalText) {
  var brokenText = normalText;

  // TODO - Write your code here

  return brokenText;
}



// End of Homework

// - Atom.io is cool code editor written in JavaScript
