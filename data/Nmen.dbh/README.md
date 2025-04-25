# Original methods

This is how I created the Nmen database from original files
and according to the hash database specification.

I need these files

* refs.fasta
* profiles.tsv
* clusters.tsv
* alleles.tsv
* isolates.tsv (not part of the specification)

## isolates.tsv

I went to the pubmlst site and downloaded isolates including LINCodes and cgMLST into a spreadsheet.
Although you cannot download everything at once, I downloaded the first ten thousand into `isolates.tsv.tmp`.
Then, I filtered for those with cgMLST.

```bash
mkdir Nmen.dbh
cat isolates.tsv.tmp | perl -F'\t' -lane 'next if(!$F[1335]); print;' > Nmen.dbh/isolates.tsv
```

## refs.fasta and alleles.tsv

Need to download all loci to get `refs.fasta` and `alleles.tsv`.

```bash
# Get list of loci for this scheme Nmen cgMLST v3, ID 88
wget "https://rest.pubmlst.org/db/pubmlst_neisseria_seqdef/schemes/88/loci" -O loci.json

# Download all loci
mkdir locus.xargs
cat loci.json | \
  perl -lane 'while(/(https.+?loci\/(\w+))/g){$URL="$1/alleles_fasta"; print $URL;}' | \
  xargs -P 4 -n 1 bash -c '
    dir=$(dirname $0); 
    locus=$(basename $dir); 
    target="locus.xargs/$locus.fasta"; 
    if [ -e $target ]; then 
      exit; 
    fi; 
    echo $locus >&2; 
    wget -O $target.tmp $0 2>/dev/null && mv $target.tmp $target;
  '

# format
cd .. # in the db directory
perl ../scripts/digestFasta.pl -o Nmen.dbh Nmen/loci/*.fasta --hash md5 --force
```

Now we have a folder `db/Nmen.dbh` that contains `refs.fasta` and `alleles.tsv`.

## profiles.tsv

The alleles.tsv file looks sort of like this now

```text
## hash-alleles-format v0.4
# locus allele  hash-type
NEIS0001        UOM/xntDYHMRhA47qiIueQ  md5     was=1;start-sequence=ATG;stop-sequence=TAA;length=924
NEIS0001        N612rWygdQFHPvrIpjrVfg  md5     was=2;start-sequence=ATG;stop-sequence=TAA;length=924
```

```bash
perl ../scripts/intProfilesToHashes.pl Nmen.dbh
```

This creates `profiles.tsv` in the `Nmen.dbh` directory.

I wanted to update a few fields in `profiles.tsv` and so I ran this one liner:

```bash
cp data/Nmen.dbh/profiles.tsv data/Nmen.dbh/profiles.tsv.bak
cat data/Nmen.dbh/profiles.tsv.bak | \
  perl -F'\t' -lane '
    $id = $F[3]; 
    if(!$id){ 
      if($F[1]){ 
        $id="PM-$F[1]";
      }
    } 
    if(!$id){
      $id=$F[0];
    } 
    if($.==1){
      $id="ID";
    } 
    print join("\t",$id,@F[5..scalar(@F)-1]);
  ' > data/Nmen.dbh/profiles.tsv
```

## clusters.tsv

There are LINCodes in this database and so it is appropriate to make `clusters.tsv`.

```bash
cat Nmen.dbh/isolates.tsv | perl -F'\t' -lane '
  # determine strain name as either biosample, isolate, or pubmlst ID.
  $strain="$F[3]"||"ISOLATE-$F[1]"||"PUBMLST-$F[0]"||"UNKNOWN"; 
  $strain=~s/\s+//g;# remove icky whitespace
  $strain=~s/;.*//; # remove semicolon delimited alt names
  $lin=$F[1335];
  print join("\t", $strain, "LINCode", $lin);
' > Nmen.dbh/clusters.tsv
```

## Cleanup

Here are some suggested ways to archive unnecessary files.

```bash
cd Nmen.dbh
mkdir archive
# mv isolates.tsv into archive
mv -nv isolates.tsv archive/
# cp alleles.tsv with attributes field into archive
cp -nv alleles.tsv archive/
# only copy back the first three fields out of archive
cut -f 1-3 archive/alleles.tsv > alleles.tsv
```

Now to compress the archive

```bash
cd archive
gzip -9v isolates.tsv alleles.tsv
```
