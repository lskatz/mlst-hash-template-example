# How to submit new alleles

All data live in a database at <https://github.com/lskatz/mlst-hash-template-example>.
The specification for how the data are formatted is at <https://lskatz.github.io/mlst-hash-template-example/docs/specification.html>.

Essentially, to add a new sample to the database is to make a pull request with these files.

## Files to change

Your data have to be concatenated to these files.

* `refs.fasta`
* `alleles.tsv`
* `profiles.tsv`
* `clusters.tsv`

### refs.fasta and alleles.tsv

This is the bare minimum.
Add any new alleles to `alleles.tsv`.
In this database, alleles are coded with md5sums.

If you have a new locus, add it to `refs.fasta`.

### profiles.tsv

If you have samples, add them to `profiles.tsv`.
In this database, alleles are coded with md5sums.
Also in this database, there is a field with `LINCode` which is a nonstandard way to display the data.
A future direction should be to entirely move the LINCodes to `clusters.tsv`.

### clusters.tsv

For each sample, call the LINCode and then add that in the third field in `clusters.tsv`.

## Pull request

Once these files are modified, make a new branch in your space, and then make a pull request from your branch to this master branch.
There are some automated tests to ensure this all works and then we will manually review.
