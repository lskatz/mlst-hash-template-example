# About

This is a natural next step the multilocus sequence typing (MLST) database spec for hashes.
In this overall project, we take the idea behind MLST but run a hashsum for every allelic sequence to make a unique identifier[^1].
At this time, this project is now divided into two steps:

[^1]: Yes I know that hashes are not unique but in my [in-silico experiment](https://lskatz.github.io/posts/2024/07/30/hash-collision-experiment.html), I could not find any collisions nor make enough allele hashes to force a collision.

1. MLST hash database storage
2. MLST hash database query

## MLST hash database storage

This is a space to store MLST alleles with mechanisms to add/remove/curate/share
those alleles.

### Advantages

1. Contextualize genomes with what else is out there
2. Alleles are hashed and so sequence data are not revealed
3. The hash is a fixed length, and so it is an easy check to see if an allele has been truncated.
4. Frees the database from funding sources.
5. Git repo!
   * ... can be copied and/or made decentralized easily.
   * ... can be versioned
   * ... can be forked - individuals or institutions can decide to have their own database
   * ... can be pushed - new alleles or loci can be updated
   * ... can be pulled - databases can update with the latest alleles or loci

### Disadvantages

1. Allelic sequences are lost through hashing.
2. The database creates a limited way that the database can be queried: either the query hits against an exact hashsum or it doesn't.
3. The database does not state whether any one allele conforms to any one rule. For example, it is unknown if a particular allele is bound by start and stop sites.
4. There is a lot of work ahead of us.

## MLST hash query

Knowing that we now have a database with hashes and that it is defined in a specification, we can now think about how best to query the database.

TODO
