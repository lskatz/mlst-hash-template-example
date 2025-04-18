
    refs.fasta
    profiles.tsv
    clusters.tsv
    alleles.tsv


```bash
# Get list of loci for this scheme Nmen cgMLST v3, ID 88
wget "https://rest.pubmlst.org/db/pubmlst_neisseria_seqdef/schemes/88/loci" -O loci.json

# Download all loci
nohup cat loci.json | perl -lane 'while(/(https.+?loci\/(\w+))/g){system("wget -c $1 -O loci/$2.fasta"); die if $?; }' > nohup.log 2>&1 &

## not sure if this next step is right for us but...
# Download 10k isolates from pubmlst into isolates.tsv.gz
zcat isolates.tsv.gz | perl -F'\t' -lane 'next if(!$F[1335]); $strain="$F[3]"||$F[1]||$F[0]||"UNKNOWN"; $strain=~s/\s+//g; print join("\t", $strain, "LINCode", $F[1335])' > clusters.tsv

```


